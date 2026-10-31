-- ==============================================================================
-- Migration 008: Security Hardening & RPC Access Control (Hotfix)
-- ==============================================================================
-- Garante a criação segura das RPCs e fecha todas as brechas de execução anônima.
-- Ordem de execução:
-- 1. Habilitar extensões necessárias (pgcrypto)
-- 2. Alterar privilégios padrão para que novas funções não sejam públicas
-- 3. Estruturar tabela admin_users e promover fundadores a super_admin
-- 4. Criar/Substituir funções com validação estrita de super_admin
-- 5. Revogar privilégios de PUBLIC e ANON e conceder apenas a AUTHENTICATED
-- ==============================================================================

-- 1. Garantir extensão pgcrypto
create extension if not exists pgcrypto with schema extensions;

-- 2. Bloquear concessão automática de execução para PUBLIC e ANON no schema public
alter default privileges in schema public revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon;

-- 3. Atualizar tabela admin_users com a coluna role
alter table public.admin_users
  add column if not exists email text null,
  add column if not exists role text not null default 'admin';

update public.admin_users
set role = 'super_admin'
where user_id in (
  'f9775608-a259-479f-bb4f-343819ab8f43'::uuid, -- Renan Fernandes
  'c042913b-b249-43f5-a0ff-a88ef1927d24'::uuid, -- Paulo Roberto
  '731d2560-3eb7-42c2-9c21-7395835bffbd'::uuid  -- Lucas Nascimento
);

-- 4. Função auxiliar: is_super_admin()
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
      and user_id in (
        'f9775608-a259-479f-bb4f-343819ab8f43'::uuid,
        'c042913b-b249-43f5-a0ff-a88ef1927d24'::uuid,
        '731d2560-3eb7-42c2-9c21-7395835bffbd'::uuid
      )
  );
$$;

-- 5. RPC Segura: admin_reset_user_password
create or replace function public.admin_reset_user_password(
  target_user_id uuid,
  new_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  caller_id uuid := auth.uid();
begin
  -- Validação estrita: apenas fundadores autenticados
  if caller_id is null or not public.is_super_admin() then
    raise exception 'Apenas os administradores fundadores possuem permissão para resetar senhas.';
  end if;

  -- NENHUM fundador pode resetar a senha de outro fundador
  if target_user_id in (
    'f9775608-a259-479f-bb4f-343819ab8f43'::uuid,
    'c042913b-b249-43f5-a0ff-a88ef1927d24'::uuid,
    '731d2560-3eb7-42c2-9c21-7395835bffbd'::uuid
  ) and target_user_id <> caller_id then
    raise exception 'As contas dos administradores fundadores são fixas e só podem ser alteradas por eles mesmos.';
  end if;

  if length(new_password) < 6 then
    raise exception 'A senha deve possuir pelo menos 6 caracteres.';
  end if;

  update auth.users
  set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
      updated_at = now()
  where id = target_user_id;

  return true;
end;
$$;

-- 6. RPC Segura: admin_create_user
create or replace function public.admin_create_user(
  new_email text,
  new_password text,
  new_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  caller_id uuid := auth.uid();
  new_user_id uuid := gen_random_uuid();
  encrypted_pw text;
  clean_email text := lower(trim(new_email));
  clean_name text := trim(new_display_name);
begin
  -- Validação estrita: apenas fundadores autenticados
  if caller_id is null or not public.is_super_admin() then
    raise exception 'Apenas os administradores fundadores possuem permissão para cadastrar novos administradores.';
  end if;

  if clean_email is null or clean_email = '' or clean_email not like '%@%' then
    raise exception 'Informe um e-mail válido.';
  end if;

  if length(new_password) < 6 then
    raise exception 'A senha deve ter pelo menos 6 caracteres.';
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
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    clean_email,
    encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('display_name', clean_name),
    now(),
    now()
  );

  insert into public.admin_users (user_id, display_name, email, role)
  values (new_user_id, clean_name, clean_email, 'admin');

  return jsonb_build_object(
    'user_id', new_user_id,
    'email', clean_email,
    'display_name', clean_name
  );
end;
$$;

-- 7. RPC Segura: admin_delete_user
create or replace function public.admin_delete_user(
  target_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  caller_id uuid := auth.uid();
begin
  -- Validação estrita: apenas fundadores autenticados
  if caller_id is null or not public.is_super_admin() then
    raise exception 'Apenas os administradores fundadores podem excluir usuários.';
  end if;

  if target_user_id in (
    'f9775608-a259-479f-bb4f-343819ab8f43'::uuid,
    'c042913b-b249-43f5-a0ff-a88ef1927d24'::uuid,
    '731d2560-3eb7-42c2-9c21-7395835bffbd'::uuid
  ) then
    raise exception 'As contas dos fundadores são fixas e não podem ser excluídas.';
  end if;

  delete from public.admin_users where user_id = target_user_id;
  delete from auth.users where id = target_user_id;
  return true;
end;
$$;

-- 8. Revogação explícita de execução para PUBLIC e ANON (agora que as funções existem com certeza)
revoke all on function public.is_super_admin() from public, anon;
revoke all on function public.admin_reset_user_password(uuid, text) from public, anon;
revoke all on function public.admin_create_user(text, text, text) from public, anon;
revoke all on function public.admin_delete_user(uuid) from public, anon;

-- 9. Concessão de execução exclusivamente para AUTHENTICATED
grant execute on function public.is_super_admin() to authenticated;
grant execute on function public.admin_reset_user_password(uuid, text) to authenticated;
grant execute on function public.admin_create_user(text, text, text) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- 10. Proteção resiliente para set_student_khan se ela existir
do $$
begin
  execute 'revoke all on function public.set_student_khan(uuid, integer, date, boolean) from public, anon';
  execute 'grant execute on function public.set_student_khan(uuid, integer, date, boolean) to authenticated';
exception
  when undefined_function then null;
end $$;
