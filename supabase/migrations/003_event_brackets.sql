-- ==============================================================================
-- Migration 003: Chaveamentos de torneio/competição vinculados a eventos
-- ==============================================================================

create table if not exists public.event_brackets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null check (char_length(title) <= 150),
  category_name text null check (category_name is null or char_length(category_name) <= 100),
  bracket_type text not null default 'single_elimination' check (bracket_type in ('single_elimination', 'super_fights', 'round_robin')),
  rounds jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

comment on table public.event_brackets is 'Chaveamentos de lutas de competição vinculados a um evento.';

create index if not exists idx_event_brackets_event_id on public.event_brackets(event_id);

-- Trigger de updated_at
drop trigger if exists set_event_brackets_updated_at on public.event_brackets;
create trigger set_event_brackets_updated_at
before update on public.event_brackets
for each row execute function public.handle_updated_at();

-- Habilita RLS
alter table public.event_brackets enable row level security;

-- Política de leitura: público pode visualizar se o evento for publicado ou se o usuário for admin
drop policy if exists "Chaveamentos públicos de eventos publicados" on public.event_brackets;
create policy "Chaveamentos públicos de eventos publicados"
on public.event_brackets
for select
using (
  exists (
    select 1 from public.events e
    where e.id = event_brackets.event_id
      and (e.status = 'published' or public.is_admin())
  )
);

-- Políticas de escrita: apenas administradores
drop policy if exists "Administradores podem inserir chaveamentos" on public.event_brackets;
create policy "Administradores podem inserir chaveamentos"
on public.event_brackets
for insert
with check (public.is_admin());

drop policy if exists "Administradores podem atualizar chaveamentos" on public.event_brackets;
create policy "Administradores podem atualizar chaveamentos"
on public.event_brackets
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Administradores podem excluir chaveamentos" on public.event_brackets;
create policy "Administradores podem excluir chaveamentos"
on public.event_brackets
for delete
using (public.is_admin());

-- Grants
grant select on public.event_brackets to anon, authenticated;
grant insert, update, delete on public.event_brackets to authenticated;
