-- ==============================================================================
-- 001_initial_schema.sql
-- Pride Muay Thai - Initial Database Schema & RLS Policies
-- ==============================================================================

-- 1. Tab: admin_users
-- Armazena os UUIDs de auth.users autorizados a administrar o sistema.
-- Administradores iniciais provisionados via dashboard ou migration controlada.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

-- 2. Tab: events
-- Armazena publicações de eventos, torneios, graduações e seminários.
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('competition', 'graduation', 'seminar', 'special_training', 'other')),
  title text not null check (char_length(title) <= 120),
  summary text not null check (char_length(summary) <= 300),
  description text not null check (char_length(description) <= 5000),
  event_date timestamptz not null,
  end_date timestamptz null,
  location text not null check (char_length(location) <= 200),
  requirements text null check (requirements is null or char_length(requirements) <= 2000),
  registration_info text null check (registration_info is null or char_length(registration_info) <= 2000),
  registration_url text null,
  contact text null check (contact is null or char_length(contact) <= 200),
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled')),
  published_at timestamptz null,
  image_url text null, -- Reservado para uso futuro; sem upload nesta versão
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

-- 3. Tab: students
-- Armazena alunos registrados na equipe e seu maior Khan atual (1 a 16).
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 150),
  slug text not null unique,
  current_khan integer not null default 1 check (current_khan between 1 and 16),
  is_active boolean not null default true,
  is_published boolean not null default true,
  image_url text null, -- Reservado para uso futuro; sem upload nesta versão
  gym_ids text[] not null default '{}', -- Academias onde o aluno treina (opcional)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

-- 4. Tab: student_graduations
-- Armazena os Khans conquistados (1 a 16) pelo aluno e a data de graduação.
create table if not exists public.student_graduations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  khan_level integer not null check (khan_level between 1 and 16),
  achieved_at date null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  constraint uq_student_khan unique (student_id, khan_level)
);

-- ==============================================================================
-- Índices
-- ==============================================================================
create index if not exists idx_events_status_date on public.events(status, event_date desc);
create index if not exists idx_events_category_date on public.events(category, event_date desc);
create index if not exists idx_events_event_date on public.events(event_date);
create index if not exists idx_events_slug on public.events(slug);

create index if not exists idx_students_name on public.students(name);
create index if not exists idx_students_current_khan on public.students(current_khan);
create index if not exists idx_students_active_published on public.students(is_active, is_published);
create index if not exists idx_students_slug on public.students(slug);
create index if not exists idx_students_gym_ids on public.students using gin(gym_ids);

create index if not exists idx_student_graduations_student_khan on public.student_graduations(student_id, khan_level);

-- ==============================================================================
-- Triggers de atualização automática de updated_at
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
  before update on public.events
  for each row
  execute function public.handle_updated_at();

drop trigger if exists trg_students_updated_at on public.students;
create trigger trg_students_updated_at
  before update on public.students
  for each row
  execute function public.handle_updated_at();

-- ==============================================================================
-- Função de Autorização: is_admin()
-- Compara auth.uid() com public.admin_users de forma segura.
-- ==============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- ==============================================================================
-- RPC Transacional: set_student_khan
-- Registra progressão cumulativa ou correção autorizada de graduação.
-- ==============================================================================
create or replace function public.set_student_khan(
  target_student_id uuid,
  target_khan integer,
  achieved_at_date date default null,
  correction_mode boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_curr_khan integer;
  lvl integer;
begin
  -- 1. Validação de administrador
  if not public.is_admin() then
    raise exception 'Apenas administradores podem gerenciar graduações.';
  end if;

  -- 2. Validação do intervalo
  if target_khan < 1 or target_khan > 16 then
    raise exception 'Khan inválido. O nível deve estar entre 1 e 16.';
  end if;

  -- 3. Localizar aluno
  select current_khan into v_curr_khan
  from public.students
  where id = target_student_id;

  if not found then
    raise exception 'Aluno não encontrado.';
  end if;

  -- 4. Validação de regressão sem modo de correção
  if target_khan < v_curr_khan and not correction_mode then
    raise exception 'Redução de Khan exige confirmação explícita de correção.';
  end if;

  -- 5. Se em modo de correção reduzindo Khan, remover graduações superiores
  if correction_mode and target_khan < v_curr_khan then
    delete from public.student_graduations
    where student_id = target_student_id
      and khan_level > target_khan;
  end if;

  -- 6. Garantir preenchimento cumulativo sem lacunas (1 até target_khan)
  for lvl in 1..target_khan loop
    insert into public.student_graduations (
      student_id,
      khan_level,
      achieved_at,
      created_by
    )
    values (
      target_student_id,
      lvl,
      case when lvl = target_khan then achieved_at_date else null end,
      auth.uid()
    )
    on conflict (student_id, khan_level) do update
      set achieved_at = case
        when lvl = target_khan and achieved_at_date is not null then achieved_at_date
        else public.student_graduations.achieved_at
      end;
  end loop;

  -- 7. Atualizar registro do aluno
  update public.students
  set
    current_khan = target_khan,
    updated_at = now(),
    updated_by = auth.uid()
  where id = target_student_id;
end;
$$;

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================
alter table public.admin_users enable row level security;
alter table public.events enable row level security;
alter table public.students enable row level security;
alter table public.student_graduations enable row level security;

-- admin_users policies
-- Somente administradores autenticados podem ver a lista de administradores
drop policy if exists "admin_users_select" on public.admin_users;
create policy "admin_users_select"
  on public.admin_users for select
  using (public.is_admin());

-- events policies
-- Visitante / público: apenas publicados ou cancelados previamente publicados
drop policy if exists "events_select" on public.events;
create policy "events_select"
  on public.events for select
  using (
    status = 'published'
    or (status = 'cancelled' and published_at is not null)
    or public.is_admin()
  );

drop policy if exists "events_insert" on public.events;
create policy "events_insert"
  on public.events for insert
  with check (public.is_admin());

drop policy if exists "events_update" on public.events;
create policy "events_update"
  on public.events for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "events_delete" on public.events;
create policy "events_delete"
  on public.events for delete
  using (public.is_admin());

-- students policies
-- Visitante / público: apenas ativos e publicados
drop policy if exists "students_select" on public.students;
create policy "students_select"
  on public.students for select
  using (
    (is_active = true and is_published = true)
    or public.is_admin()
  );

drop policy if exists "students_insert" on public.students;
create policy "students_insert"
  on public.students for insert
  with check (public.is_admin());

drop policy if exists "students_update" on public.students;
create policy "students_update"
  on public.students for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "students_delete" on public.students;
create policy "students_delete"
  on public.students for delete
  using (public.is_admin());

-- student_graduations policies
-- Visitante / público: visíveis apenas quando o aluno correspondente for ativo e publicado
drop policy if exists "graduations_select" on public.student_graduations;
create policy "graduations_select"
  on public.student_graduations for select
  using (
    exists (
      select 1 from public.students s
      where s.id = student_graduations.student_id
        and ((s.is_active = true and s.is_published = true) or public.is_admin())
    )
  );

drop policy if exists "graduations_insert" on public.student_graduations;
create policy "graduations_insert"
  on public.student_graduations for insert
  with check (public.is_admin());

drop policy if exists "graduations_update" on public.student_graduations;
create policy "graduations_update"
  on public.student_graduations for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "graduations_delete" on public.student_graduations;
create policy "graduations_delete"
  on public.student_graduations for delete
  using (public.is_admin());

-- ==============================================================================
-- Grants
-- ==============================================================================
grant usage on schema public to anon, authenticated;

grant select on public.events to anon, authenticated;
grant select on public.students to anon, authenticated;
grant select on public.student_graduations to anon, authenticated;
grant select on public.admin_users to authenticated;

grant all on public.events to authenticated;
grant all on public.students to authenticated;
grant all on public.student_graduations to authenticated;
grant all on public.admin_users to authenticated;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.set_student_khan(uuid, integer, date, boolean) to authenticated;
