-- ==============================================================================
-- Migration 004: Controle de Visibilidade de Chaveamentos (Público vs Privado)
-- ==============================================================================

-- Adiciona a coluna is_published com valor padrão false (privado/apenas administradores)
alter table public.event_brackets
  add column if not exists is_published boolean not null default false;

comment on column public.event_brackets.is_published is 'Indica se o chaveamento é visível publicamente na página do evento (true) ou visível apenas para os administradores logados (false).';

-- Atualiza a política de leitura do RLS
drop policy if exists "Chaveamentos públicos de eventos publicados" on public.event_brackets;

create policy "Chaveamentos públicos de eventos publicados"
on public.event_brackets
for select
using (
  public.is_admin() or (
    is_published = true and exists (
      select 1 from public.events e
      where e.id = event_brackets.event_id
        and e.status = 'published'
    )
  )
);
