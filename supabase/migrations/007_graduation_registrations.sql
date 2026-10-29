-- ==============================================================================
-- 007_graduation_registrations.sql
-- Pride Muay Thai - Inscrições e Gestão de Graduações
-- ==============================================================================

-- 1. Extensão da tabela events com controle de inscrições de graduação
alter table public.events
  add column if not exists graduation_registration_enabled boolean not null default false,
  add column if not exists graduation_registration_deadline timestamptz null;

-- Regras de integridade na tabela events
alter table public.events
  drop constraint if exists chk_events_graduation_registration_category,
  add constraint chk_events_graduation_registration_category
    check (graduation_registration_enabled = false or category = 'graduation');

alter table public.events
  drop constraint if exists chk_events_graduation_registration_deadline,
  add constraint chk_events_graduation_registration_deadline
    check (graduation_registration_enabled = false or graduation_registration_deadline is not null);

alter table public.events
  drop constraint if exists chk_events_graduation_deadline_before_start,
  add constraint chk_events_graduation_deadline_before_start
    check (graduation_registration_deadline is null or graduation_registration_deadline <= event_date);

-- 2. Criação da tabela graduation_registrations
create table if not exists public.graduation_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  student_id uuid null references public.students(id) on delete set null,
  full_name text not null check (char_length(full_name) <= 150 and char_length(trim(full_name)) > 0),
  current_khan_at_registration integer null check (current_khan_at_registration is null or (current_khan_at_registration between 1 and 16)),
  target_khan integer not null check (target_khan between 1 and 16),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  paid_at timestamptz null,
  paid_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Trigger para updated_at automático
drop trigger if exists trg_graduation_registrations_updated_at on public.graduation_registrations;
create trigger trg_graduation_registrations_updated_at
  before update on public.graduation_registrations
  for each row
  execute function public.handle_updated_at();

-- 4. Índices para performance e integridade
create index if not exists idx_grad_reg_event on public.graduation_registrations(event_id);
create index if not exists idx_grad_reg_payment on public.graduation_registrations(payment_status);
create index if not exists idx_grad_reg_target_khan on public.graduation_registrations(target_khan);
create index if not exists idx_grad_reg_created_at on public.graduation_registrations(created_at desc);

-- Impede duas inscrições do mesmo aluno cadastrado no mesmo evento
create unique index if not exists uq_grad_reg_event_student
  on public.graduation_registrations(event_id, student_id)
  where student_id is not null;

-- 5. Row Level Security (RLS)
alter table public.graduation_registrations enable row level security;

-- Apenas administradores autenticados podem visualizar as inscrições
drop policy if exists "Admins can view graduation registrations" on public.graduation_registrations;
create policy "Admins can view graduation registrations"
  on public.graduation_registrations
  for select
  to authenticated
  using (public.is_admin());

-- Apenas administradores autenticados podem manipular diretamente
drop policy if exists "Admins can manage graduation registrations" on public.graduation_registrations;
create policy "Admins can manage graduation registrations"
  on public.graduation_registrations
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 6. RPC Pública Segura: submit_graduation_registration
-- Permite que visitantes realizem inscrições públicas até o prazo estipulado
create or replace function public.submit_graduation_registration(
  p_event_id uuid,
  p_target_khan integer,
  p_student_id uuid default null,
  p_manual_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events%rowtype;
  v_student public.students%rowtype;
  v_full_name text;
  v_current_khan integer := null;
  v_new_id uuid;
begin
  -- Validação 1: target_khan entre 1 e 16
  if p_target_khan is null or p_target_khan < 1 or p_target_khan > 16 then
    raise exception 'Khan pretendido inválido. Deve ser um nível entre 1 e 16.';
  end if;

  -- Validação 2: busca e regras do evento
  select * into v_event
  from public.events
  where id = p_event_id;

  if not found then
    raise exception 'Evento de graduação não encontrado.';
  end if;

  if v_event.category <> 'graduation' then
    raise exception 'Inscrições de graduação só podem ser realizadas em eventos da categoria Graduação.';
  end if;

  if v_event.status <> 'published' then
    raise exception 'Inscrições indisponíveis: este evento não está publicado.';
  end if;

  if not v_event.graduation_registration_enabled then
    raise exception 'As inscrições para este evento de graduação não estão habilitadas.';
  end if;

  if v_event.graduation_registration_deadline is null or now() > v_event.graduation_registration_deadline then
    raise exception 'As inscrições para este evento de graduação já foram encerradas.';
  end if;

  -- Validação 3: dados do aluno vs nome manual
  if p_student_id is not null then
    -- Aluno cadastrado: deve existir, estar ativo e publicado
    select * into v_student
    from public.students
    where id = p_student_id;

    if not found or not v_student.is_active or not v_student.is_published then
      raise exception 'Aluno selecionado não está ativo ou não foi localizado no cadastro oficial.';
    end if;

    -- Verificar duplicidade
    if exists (
      select 1 from public.graduation_registrations
      where event_id = p_event_id and student_id = p_student_id
    ) then
      raise exception 'Este aluno já está inscrito neste evento de graduação.';
    end if;

    -- Usar dados canônicos do banco e snapshot do khan atual
    v_full_name := v_student.name;
    v_current_khan := v_student.current_khan;
  else
    -- Nome manual obrigatório e sanitizado
    v_full_name := trim(coalesce(p_manual_name, ''));
    if char_length(v_full_name) = 0 then
      raise exception 'Informe seu nome completo para concluir a inscrição.';
    end if;

    if char_length(v_full_name) > 150 then
      raise exception 'O nome informado não pode exceder 150 caracteres.';
    end if;
  end if;

  -- Validação 4: inserir registro sempre com pagamento pendente
  insert into public.graduation_registrations (
    event_id,
    student_id,
    full_name,
    current_khan_at_registration,
    target_khan,
    payment_status
  ) values (
    p_event_id,
    p_student_id,
    v_full_name,
    v_current_khan,
    p_target_khan,
    'pending'
  )
  returning id into v_new_id;

  return v_new_id;
end;
$$;

revoke all on function public.submit_graduation_registration(uuid, integer, uuid, text) from public;
grant execute on function public.submit_graduation_registration(uuid, integer, uuid, text) to anon, authenticated;

-- 7. RPC Autenticada: set_graduation_registration_paid
-- Apenas administradores autenticados podem alterar status de pagamento
create or replace function public.set_graduation_registration_paid(
  p_registration_id uuid,
  p_is_paid boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores autorizados podem alterar o status de pagamento.';
  end if;

  if p_is_paid then
    update public.graduation_registrations
    set
      payment_status = 'paid',
      paid_at = now(),
      paid_by = auth.uid()
    where id = p_registration_id;
  else
    update public.graduation_registrations
    set
      payment_status = 'pending',
      paid_at = null,
      paid_by = null
    where id = p_registration_id;
  end if;

  if not found then
    raise exception 'Inscrição não encontrada.';
  end if;

  return true;
end;
$$;

revoke all on function public.set_graduation_registration_paid(uuid, boolean) from public;
grant execute on function public.set_graduation_registration_paid(uuid, boolean) to authenticated;
