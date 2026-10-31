-- ==============================================================================
-- Migration 012: Endurecimento do Formulário de Inscrição de Graduação & Anti-Spam
-- ==============================================================================
-- 1. Tabela transitória de rate limit sem armazenar IP bruto (usa hash pseudo-anonimizado)
-- 2. Normalização estrita de nomes de candidatos (impede duplicatas triviais)
-- 3. Prevenção contra injeção de fórmulas e caracteres maliciosos no nome
-- 4. Rate-limiting server-side no banco de dados (máx 5 inscrições por hash em 10min)
-- 5. SET search_path = '' na RPC pública submit_graduation_registration
-- ==============================================================================

begin;

-- 1. Tabela de controle de taxa de requisições (rate limiting)
create table if not exists public.registration_rate_limits (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  client_hash text not null,
  created_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_registration_rate_limits on public.registration_rate_limits(event_id, client_hash, created_at desc);

alter table public.registration_rate_limits enable row level security;

drop policy if exists "no_direct_access_rate_limits" on public.registration_rate_limits;
create policy "no_direct_access_rate_limits"
  on public.registration_rate_limits for all
  using (false);

-- 2. RPC Endurecida: submit_graduation_registration
create or replace function public.submit_graduation_registration(
  p_event_id uuid,
  p_target_khan integer,
  p_student_id uuid default null,
  p_manual_name text default null,
  p_client_hash text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event record;
  v_student record;
  v_full_name text;
  v_normalized_name text;
  v_current_khan integer := null;
  v_new_id uuid;
  v_recent_attempts integer;
  v_effective_hash text;
begin
  -- 1. Anti-Flood / Rate Limiting (se client_hash for fornecido pelo backend/Edge)
  if p_client_hash is not null and pg_catalog.length(p_client_hash) > 0 then
    v_effective_hash := pg_catalog.substr(p_client_hash, 1, 64);
    
    -- Limpa registros com mais de 24 horas
    delete from public.registration_rate_limits
    where created_at < pg_catalog.now() - interval '24 hours';

    -- Conta requisições nos últimos 10 minutos
    select count(*) into v_recent_attempts
    from public.registration_rate_limits
    where event_id = p_event_id
      and client_hash = v_effective_hash
      and created_at > pg_catalog.now() - interval '10 minutes';

    if v_recent_attempts >= 5 then
      raise exception 'Muitas tentativas de inscrição em sequência. Por favor, aguarde alguns minutos antes de tentar novamente.';
    end if;

    insert into public.registration_rate_limits (event_id, client_hash, created_at)
    values (p_event_id, v_effective_hash, pg_catalog.now());
  end if;

  -- 2. Validação do Khan pretendido
  if p_target_khan is null or p_target_khan < 1 or p_target_khan > 16 then
    raise exception 'Khan pretendido inválido. Deve ser um nível entre 1 e 16.';
  end if;

  -- 3. Validação do evento
  select * into v_event
  from public.events
  where id = p_event_id;

  if not found then
    raise exception 'Evento de graduação não encontrado.';
  end if;

  if v_event.category <> 'graduation' then
    raise exception 'Inscrições só podem ser realizadas em eventos da categoria Graduação.';
  end if;

  if v_event.status <> 'published' then
    raise exception 'Inscrições indisponíveis: este evento não está publicado.';
  end if;

  if not v_event.graduation_registration_enabled then
    raise exception 'As inscrições para este evento de graduação não estão habilitadas.';
  end if;

  if v_event.graduation_registration_deadline is null or pg_catalog.now() > v_event.graduation_registration_deadline then
    raise exception 'As inscrições para este evento de graduação já foram encerradas.';
  end if;

  -- 4. Aluno Cadastrado vs Candidato Manual
  if p_student_id is not null then
    select * into v_student
    from public.students
    where id = p_student_id;

    if not found or not v_student.is_active or not v_student.is_published then
      raise exception 'Aluno selecionado não está ativo ou não foi localizado no cadastro oficial.';
    end if;

    if exists (
      select 1 from public.graduation_registrations
      where event_id = p_event_id and student_id = p_student_id
    ) then
      raise exception 'Este aluno já está inscrito neste evento de graduação.';
    end if;

    v_full_name := v_student.name;
    v_current_khan := v_student.current_khan;
  else
    v_full_name := pg_catalog.trim(coalesce(p_manual_name, ''));
    if pg_catalog.length(v_full_name) < 3 then
      raise exception 'Informe seu nome completo (mínimo de 3 caracteres).';
    end if;

    if pg_catalog.length(v_full_name) > 100 then
      raise exception 'O nome informado não pode exceder 100 caracteres.';
    end if;

    -- Prevenção de caracteres de injeção de fórmulas e caracteres de controle
    if v_full_name ~ '^[\=\+\-\@\t\r\n]' then
      raise exception 'O nome não pode iniciar com caracteres especiais ou fórmulas (=, +, -, @).';
    end if;

    -- Normalização de espaços duplos e minúsculas para checagem de duplicidade
    v_normalized_name := pg_catalog.lower(pg_catalog.regexp_replace(v_full_name, '\s+', ' ', 'g'));

    if exists (
      select 1 from public.graduation_registrations
      where event_id = p_event_id
        and student_id is null
        and pg_catalog.lower(pg_catalog.regexp_replace(full_name, '\s+', ' ', 'g')) = v_normalized_name
    ) then
      raise exception 'Já existe uma inscrição pendente para este candidato neste evento.';
    end if;
  end if;

  -- 5. Inserir inscrição sempre com payment_status = pending
  insert into public.graduation_registrations (
    event_id,
    student_id,
    full_name,
    current_khan_at_registration,
    target_khan,
    payment_status,
    created_at,
    updated_at
  ) values (
    p_event_id,
    p_student_id,
    v_full_name,
    v_current_khan,
    p_target_khan,
    'pending',
    pg_catalog.now(),
    pg_catalog.now()
  )
  returning id into v_new_id;

  return v_new_id;
end;
$$;

-- Permissões
revoke all on function public.submit_graduation_registration(uuid, integer, uuid, text, text) from public;
grant execute on function public.submit_graduation_registration(uuid, integer, uuid, text, text) to anon, authenticated;

commit;
