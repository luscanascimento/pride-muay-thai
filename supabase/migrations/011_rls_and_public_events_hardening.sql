-- ==============================================================================
-- Migration 011: Matriz RLS Reforçada, Prevenção de Vazamento PIX e Ownership Seguro
-- ==============================================================================
-- 1. Cria a View pública public.public_events mascarando pix_key quando show_pix = false
-- 2. Reforça RLS de event_brackets para impedir que admins delegados alterem
--    chaveamentos de eventos de outros administradores
-- 3. Triggers para cravar created_by e updated_by pelo banco via auth.uid()
--    e proibir troca arbitrária de ownership
-- ==============================================================================

begin;

-- 1. View Pública de Eventos com Mascaramento de Chave PIX
create or replace view public.public_events
as
select
  id,
  slug,
  category,
  title,
  summary,
  description,
  event_date,
  end_date,
  location,
  requirements,
  registration_info,
  registration_url,
  contact,
  status,
  published_at,
  image_url,
  price,
  show_pix,
  case when show_pix = true then pix_key else null end as pix_key,
  show_instagram,
  show_youtube,
  graduation_registration_enabled,
  graduation_registration_deadline,
  created_at,
  updated_at
from public.events
where status = 'published'
   or (status = 'cancelled' and published_at is not null);

comment on view public.public_events is 'View pública segura de eventos. Oculta pix_key quando show_pix é falso e omite metadados administrativos internos.';

grant select on public.public_events to anon, authenticated;

-- 2. Função de Triggers para Definir Ownership e Evitar Troca Arbitrária
create or replace function public.set_ownership_and_audit_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if TG_OP = 'INSERT' then
    NEW.created_by := auth.uid();
    NEW.updated_by := auth.uid();
    NEW.created_at := pg_catalog.now();
    NEW.updated_at := pg_catalog.now();
  elsif TG_OP = 'UPDATE' then
    -- Impede troca arbitrária de ownership; apenas super-admin pode reatribuir
    if OLD.created_by is not null and NEW.created_by is distinct from OLD.created_by then
      if not public.is_super_admin() then
        NEW.created_by := OLD.created_by;
      end if;
    end if;
    NEW.updated_by := auth.uid();
    NEW.updated_at := pg_catalog.now();
  end if;
  return NEW;
end;
$$;

-- Triggers de Ownership em events e event_brackets
drop trigger if exists trg_events_ownership on public.events;
create trigger trg_events_ownership
before insert or update on public.events
for each row execute function public.set_ownership_and_audit_fields();

drop trigger if exists trg_event_brackets_ownership on public.event_brackets;
create trigger trg_event_brackets_ownership
before insert or update on public.event_brackets
for each row execute function public.set_ownership_and_audit_fields();

-- 3. RLS de event_brackets: Administrador Delegado só pode alterar chaveamento de seu próprio evento
drop policy if exists "Administradores podem inserir chaveamentos" on public.event_brackets;
create policy "Administradores podem inserir chaveamentos"
on public.event_brackets
for insert
with check (
  public.is_super_admin() or (
    public.is_admin() and exists (
      select 1 from public.events e
      where e.id = event_brackets.event_id
        and (e.created_by is null or e.created_by = auth.uid())
    )
  )
);

drop policy if exists "Administradores podem atualizar chaveamentos" on public.event_brackets;
create policy "Administradores podem atualizar chaveamentos"
on public.event_brackets
for update
using (
  public.is_super_admin() or (
    public.is_admin() and exists (
      select 1 from public.events e
      where e.id = event_brackets.event_id
        and (e.created_by is null or e.created_by = auth.uid())
    )
  )
)
with check (
  public.is_super_admin() or (
    public.is_admin() and exists (
      select 1 from public.events e
      where e.id = event_brackets.event_id
        and (e.created_by is null or e.created_by = auth.uid())
    )
  )
);

drop policy if exists "Administradores podem excluir chaveamentos" on public.event_brackets;
create policy "Administradores podem excluir chaveamentos"
on public.event_brackets
for delete
using (
  public.is_super_admin() or (
    public.is_admin() and exists (
      select 1 from public.events e
      where e.id = event_brackets.event_id
        and (e.created_by is null or e.created_by = auth.uid())
    )
  )
);

commit;
