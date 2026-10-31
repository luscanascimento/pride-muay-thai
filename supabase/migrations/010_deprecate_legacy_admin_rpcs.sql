-- ==============================================================================
-- Migration 010: Revogação Definitiva de RPCs Legadas de Usuário (Pós Edge Function)
-- ==============================================================================
-- ATENÇÃO: Esta migration deve ser aplicada após o deploy e ativação da
-- Supabase Edge Function 'admin-users'.
-- Ela revoga o privilégio de execução das RPCs legadas que manipulavam auth.users
-- diretamente via SQL, migrando o controle para a Edge Function server-side.
-- ==============================================================================

begin;

-- Revoga a execução de authenticated das RPCs antigas de manipulação de auth.users
do $$
begin
  if to_regprocedure('public.admin_create_user(text, text, text)') is not null then
    execute 'revoke all on function public.admin_create_user(text, text, text) from public, anon, authenticated';
  end if;

  if to_regprocedure('public.admin_reset_user_password(uuid, text)') is not null then
    execute 'revoke all on function public.admin_reset_user_password(uuid, text) from public, anon, authenticated';
  end if;

  if to_regprocedure('public.admin_delete_user(uuid)') is not null then
    execute 'revoke all on function public.admin_delete_user(uuid) from public, anon, authenticated';
  end if;
end $$;

commit;
