-- ==============================================================================
-- Migration 009: Endurecimento de Segurança de Funções SECURITY DEFINER & Auditoria
-- ==============================================================================
-- Aplica as melhores práticas de segurança para PostgreSQL e Supabase:
-- 1. SET search_path = '' em todas as funções SECURITY DEFINER para mitigar ataques de search_path
-- 2. Qualificação explícita de schemas (public, auth, extensions, pg_catalog)
-- 3. Validação rigorosa de auth.uid() e autorização interna
-- 4. Revogação explícita de EXECUTE de PUBLIC e anon (e de authenticated antes de re-concessão seletiva)
-- 5. Tratamento de exceção: erro se o target_user_id não existir ao invés de retornar true silenciosamente
-- 6. Elevação da complexidade mínima de senha administrativa para 12 caracteres
-- 7. Criação da tabela append-only public.admin_audit_logs com RLS fechada
-- ==============================================================================

begin;

-- 1. Tabela Append-Only de Auditoria Administrativa
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor_user_id uuid null references auth.users(id) on delete set null,
  target_user_id uuid null,
  status text not null check (status in ('success', 'failure')),
  occurred_at timestamptz not null default pg_catalog.now(),
  metadata jsonb not null default '{}'::jsonb
);

comment on table public.admin_audit_logs is 'Registro imutável de auditoria administrativa (append-only). Nunca armazena senhas, tokens ou hashes.';

create index if not exists idx_admin_audit_logs_occurred_at on public.admin_audit_logs(occurred_at desc);
create index if not exists idx_admin_audit_logs_actor on public.admin_audit_logs(actor_user_id);
create index if not exists idx_admin_audit_logs_target on public.admin_audit_logs(target_user_id);

-- RLS para tabela de auditoria
alter table public.admin_audit_logs enable row level security;

drop policy if exists "super_admin_read_audit_logs" on public.admin_audit_logs;
create policy "super_admin_read_audit_logs"
  on public.admin_audit_logs for select
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
        and role = 'super_admin'
    )
  );

drop policy if exists "no_direct_insert_audit_logs" on public.admin_audit_logs;
create policy "no_direct_insert_audit_logs"
  on public.admin_audit_logs for insert
  with check (false);

drop policy if exists "no_direct_update_audit_logs" on public.admin_audit_logs;
create policy "no_direct_update_audit_logs"
  on public.admin_audit_logs for update
  using (false);

drop policy if exists "no_direct_delete_audit_logs" on public.admin_audit_logs;
create policy "no_direct_delete_audit_logs"
  on public.admin_audit_logs for delete
  using (false);

-- 2. Função interna de registro de auditoria (SECURITY DEFINER com search_path = '')
create or replace function public.log_admin_action(
  p_action text,
  p_actor_user_id uuid,
  p_target_user_id uuid,
  p_status text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.admin_audit_logs (
    action,
    actor_user_id,
    target_user_id,
    status,
    occurred_at,
    metadata
  ) values (
    p_action,
    p_actor_user_id,
    p_target_user_id,
    p_status,
    pg_catalog.now(),
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

-- 3. Função auxiliar de verificação de super admin (search_path = '')
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
      and (
        role = 'super_admin'
        or user_id in (
          'f9775608-a259-479f-bb4f-343819ab8f43'::uuid,
          'c042913b-b249-43f5-a0ff-a88ef1927d24'::uuid,
          '731d2560-3eb7-42c2-9c21-7395835bffbd'::uuid
        )
      )
  );
$$;

-- 4. Função auxiliar is_admin (search_path = '')
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- 5. RPC Segura: admin_reset_user_password (search_path = '', mínimo 12 chars, erro se não existir)
create or replace function public.admin_reset_user_password(
  target_user_id uuid,
  new_password text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  target_role text;
begin
  -- Validação estrita: apenas fundadores/super_admins autenticados
  if caller_id is null or not public.is_super_admin() then
    perform public.log_admin_action('reset_password', caller_id, target_user_id, 'failure', jsonb_build_object('reason', 'unauthorized'));
    raise exception 'Apenas os administradores fundadores possuem permissão para resetar senhas.';
  end if;

  -- Verifica se o usuário alvo existe
  if not exists (select 1 from auth.users where id = target_user_id) then
    perform public.log_admin_action('reset_password', caller_id, target_user_id, 'failure', jsonb_build_object('reason', 'user_not_found'));
    raise exception 'Usuário não encontrado.';
  end if;

  -- NENHUM super_admin pode resetar a senha de outro super_admin (apenas a sua própria)
  select role into target_role from public.admin_users where user_id = target_user_id;

  if (
    target_role = 'super_admin' or target_user_id in (
      'f9775608-a259-479f-bb4f-343819ab8f43'::uuid,
      'c042913b-b249-43f5-a0ff-a88ef1927d24'::uuid,
      '731d2560-3eb7-42c2-9c21-7395835bffbd'::uuid
    )
  ) and target_user_id <> caller_id then
    perform public.log_admin_action('reset_password', caller_id, target_user_id, 'failure', jsonb_build_object('reason', 'target_is_founder_or_super_admin'));
    raise exception 'As contas dos administradores fundadores são fixas e só podem ser alteradas por eles mesmos.';
  end if;

  -- Mínimo de 12 caracteres para senhas administrativas
  if pg_catalog.length(new_password) < 12 then
    perform public.log_admin_action('reset_password', caller_id, target_user_id, 'failure', jsonb_build_object('reason', 'password_too_short'));
    raise exception 'A nova senha deve possuir pelo menos 12 caracteres.';
  end if;

  update auth.users
  set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
      updated_at = pg_catalog.now()
  where id = target_user_id;

  if not found then
    perform public.log_admin_action('reset_password', caller_id, target_user_id, 'failure', jsonb_build_object('reason', 'update_failed'));
    raise exception 'Falha ao atualizar senha do usuário.';
  end if;

  perform public.log_admin_action('reset_password', caller_id, target_user_id, 'success', jsonb_build_object('target_user_id', target_user_id));
  return true;
end;
$$;

-- 6. RPC Segura: admin_create_user (search_path = '', mínimo 12 chars)
create or replace function public.admin_create_user(
  new_email text,
  new_password text,
  new_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  new_user_id uuid := extensions.gen_random_uuid();
  encrypted_pw text;
  clean_email text := pg_catalog.lower(pg_catalog.trim(new_email));
  clean_name text := pg_catalog.trim(new_display_name);
begin
  if caller_id is null or not public.is_super_admin() then
    perform public.log_admin_action('create_user', caller_id, null, 'failure', jsonb_build_object('reason', 'unauthorized'));
    raise exception 'Apenas os administradores fundadores possuem permissão para cadastrar novos administradores.';
  end if;

  if clean_email is null or clean_email = '' or clean_email not like '%@%' then
    raise exception 'Informe um e-mail válido.';
  end if;

  if pg_catalog.length(new_password) < 12 then
    raise exception 'A senha deve ter pelo menos 12 caracteres.';
  end if;

  if exists (select 1 from auth.users where email = clean_email) then
    raise exception 'Já existe um usuário cadastrado com este e-mail.';
  end if;

  encrypted_pw := extensions.crypt(new_password, extensions.gen_salt('bf'));

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000'::uuid,
    new_user_id,
    'authenticated',
    'authenticated',
    clean_email,
    encrypted_pw,
    pg_catalog.now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    pg_catalog.jsonb_build_object('display_name', clean_name),
    pg_catalog.now(),
    pg_catalog.now()
  );

  insert into public.admin_users (user_id, display_name, email, role)
  values (new_user_id, clean_name, clean_email, 'admin');

  perform public.log_admin_action('create_user', caller_id, new_user_id, 'success', jsonb_build_object('email', clean_email, 'role', 'admin'));

  return pg_catalog.jsonb_build_object(
    'user_id', new_user_id,
    'email', clean_email,
    'display_name', clean_name
  );
end;
$$;

-- 7. RPC Segura: admin_delete_user (search_path = '', erro se não existir)
create or replace function public.admin_delete_user(
  target_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  target_role text;
begin
  if caller_id is null or not public.is_super_admin() then
    perform public.log_admin_action('delete_user', caller_id, target_user_id, 'failure', jsonb_build_object('reason', 'unauthorized'));
    raise exception 'Apenas os administradores fundadores podem excluir usuários.';
  end if;

  -- Verifica se existe antes de tentar deletar
  if not exists (select 1 from auth.users where id = target_user_id)
     and not exists (select 1 from public.admin_users where user_id = target_user_id) then
    perform public.log_admin_action('delete_user', caller_id, target_user_id, 'failure', jsonb_build_object('reason', 'user_not_found'));
    raise exception 'Usuário não encontrado.';
  end if;

  select role into target_role from public.admin_users where user_id = target_user_id;

  if target_role = 'super_admin' or target_user_id in (
    'f9775608-a259-479f-bb4f-343819ab8f43'::uuid,
    'c042913b-b249-43f5-a0ff-a88ef1927d24'::uuid,
    '731d2560-3eb7-42c2-9c21-7395835bffbd'::uuid
  ) then
    perform public.log_admin_action('delete_user', caller_id, target_user_id, 'failure', jsonb_build_object('reason', 'cannot_delete_super_admin'));
    raise exception 'As contas dos administradores fundadores são fixas e não podem ser excluídas.';
  end if;

  delete from public.admin_users where user_id = target_user_id;
  delete from auth.users where id = target_user_id;

  perform public.log_admin_action('delete_user', caller_id, target_user_id, 'success', jsonb_build_object('target_user_id', target_user_id));
  return true;
end;
$$;

-- 8. Hardening em set_student_khan (search_path = '')
create or replace function public.set_student_khan(
  target_student_id uuid,
  target_khan integer,
  achieved_at_date date default null,
  correction_mode boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_curr_khan integer;
  lvl integer;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem gerenciar graduações.';
  end if;

  if target_khan < 1 or target_khan > 16 then
    raise exception 'Khan inválido. O nível deve estar entre 1 e 16.';
  end if;

  select current_khan into v_curr_khan
  from public.students
  where id = target_student_id;

  if not found then
    raise exception 'Aluno não encontrado.';
  end if;

  if target_khan < v_curr_khan and not correction_mode then
    raise exception 'Redução de Khan exige confirmação explícita de correção.';
  end if;

  if correction_mode and target_khan < v_curr_khan then
    delete from public.student_graduations
    where student_id = target_student_id
      and khan_level > target_khan;
  end if;

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

  update public.students
  set
    current_khan = target_khan,
    updated_at = pg_catalog.now(),
    updated_by = auth.uid()
  where id = target_student_id;
end;
$$;

-- 9. Hardening em set_graduation_registration_paid (search_path = '')
create or replace function public.set_graduation_registration_paid(
  p_registration_id uuid,
  p_is_paid boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores autorizados podem alterar o status de pagamento.';
  end if;

  if p_is_paid then
    update public.graduation_registrations
    set
      payment_status = 'paid',
      paid_at = pg_catalog.now(),
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

-- 10. Revogação e Concessão de Privilégios Segura
do $$
declare
  proc text;
  procs text[] := array[
    'public.is_super_admin()',
    'public.is_admin()',
    'public.admin_reset_user_password(uuid, text)',
    'public.admin_create_user(text, text, text)',
    'public.admin_delete_user(uuid)',
    'public.log_admin_action(text, uuid, uuid, text, jsonb)',
    'public.set_student_khan(uuid, integer, date, boolean)',
    'public.set_graduation_registration_paid(uuid, boolean)'
  ];
begin
  foreach proc in array procs loop
    if to_regprocedure(proc) is not null then
      execute 'revoke all on function ' || proc || ' from public, anon, authenticated';
    end if;
  end loop;
end $$;

-- Concede execução somente para as funções administrativas autorizadas a authenticated
grant execute on function public.is_super_admin() to authenticated;
grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.admin_reset_user_password(uuid, text) to authenticated;
grant execute on function public.admin_create_user(text, text, text) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;
grant execute on function public.set_student_khan(uuid, integer, date, boolean) to authenticated;
grant execute on function public.set_graduation_registration_paid(uuid, boolean) to authenticated;

commit;
