// ==============================================================================
// Supabase Edge Function: admin-users
// ==============================================================================
// Fornece gerenciamento seguro de contas administrativas server-side.
// Utiliza a service_role exclusivamente nos segredos da Edge Function no Supabase.
// Validações:
// 1. JWT válido do autor da requisição via auth.getUser()
// 2. Confirmação no banco de dados se o chamador possui role 'super_admin'
// 3. Validação estrita de limites de payload (senha >= 12 chars, formato de e-mail)
// 4. Proteção contra modificação/exclusão de contas fundadoras
// 5. Registro automático de auditoria em public.admin_audit_logs
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FOUNDER_IDS = new Set([
  'f9775608-a259-479f-bb4f-343819ab8f43', // Renan Fernandes
  'c042913b-b249-43f5-a0ff-a88ef1927d24', // Paulo Roberto
  '731d2560-3eb7-42c2-9c21-7395835bffbd', // Lucas Nascimento
]);

serve(async (req) => {
  // Trata preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido.' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Configuração do servidor indisponível.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 1. Validar Token JWT da requisição
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Não autorizado. Faça login novamente.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  const callerUser = userData?.user;

  if (userError || !callerUser) {
    return new Response(JSON.stringify({ error: 'Sessão inválida ou expirada.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 2. Verificar se o chamador é super_admin no banco
  const { data: adminRecord, error: adminQueryError } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('user_id', callerUser.id)
    .maybeSingle();

  const isSuperAdmin =
    !adminQueryError &&
    (adminRecord?.role === 'super_admin' || FOUNDER_IDS.has(callerUser.id));

  if (!isSuperAdmin) {
    return new Response(JSON.stringify({ error: 'Acesso negado: privilégio insuficiente.' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. Processar Ação
  try {
    const body = await req.json();
    const action = String(body.action || '').trim();

    // Helper de log de auditoria
    const recordAudit = async (
      actionName: string,
      targetUserId: string | null,
      status: 'success' | 'failure',
      meta: Record<string, unknown> = {}
    ) => {
      try {
        await supabaseAdmin.from('admin_audit_logs').insert({
          action: actionName,
          actor_user_id: callerUser.id,
          target_user_id: targetUserId,
          status,
          metadata: meta,
        });
      } catch {
        // Falha no log não deve interromper resposta de segurança
      }
    };

    switch (action) {
      case 'create': {
        const email = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        const displayName = String(body.displayName || '').trim();

        if (!email || !email.includes('@') || email.length > 255) {
          return new Response(JSON.stringify({ error: 'E-mail inválido.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (password.length < 12 || password.length > 128) {
          return new Response(JSON.stringify({ error: 'A senha deve ter entre 12 e 128 caracteres.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (!displayName || displayName.length > 100) {
          return new Response(JSON.stringify({ error: 'Nome de exibição inválido (máximo 100 caracteres).' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { display_name: displayName },
        });

        if (createError || !newUser?.user) {
          await recordAudit('create_user', null, 'failure', { email, error: createError?.message });
          return new Response(JSON.stringify({ error: createError?.message || 'Erro ao criar usuário.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const createdId = newUser.user.id;
        const { error: insertError } = await supabaseAdmin.from('admin_users').insert({
          user_id: createdId,
          display_name: displayName,
          email,
          role: 'admin',
        });

        if (insertError) {
          await supabaseAdmin.auth.admin.deleteUser(createdId);
          await recordAudit('create_user', createdId, 'failure', { error: insertError.message });
          return new Response(JSON.stringify({ error: 'Erro ao registrar administrador no sistema.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        await recordAudit('create_user', createdId, 'success', { email, role: 'admin' });
        return new Response(
          JSON.stringify({
            user_id: createdId,
            email,
            display_name: displayName,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reset_password': {
        const targetUserId = String(body.targetUserId || '').trim();
        const newPassword = String(body.newPassword || '');

        if (!targetUserId) {
          return new Response(JSON.stringify({ error: 'Identificador do usuário alvo é obrigatório.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (newPassword.length < 12 || newPassword.length > 128) {
          return new Response(JSON.stringify({ error: 'A nova senha deve ter entre 12 e 128 caracteres.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Bloqueio contra reset de outro super-admin
        if (FOUNDER_IDS.has(targetUserId) && targetUserId !== callerUser.id) {
          await recordAudit('reset_password', targetUserId, 'failure', { reason: 'cannot_reset_other_founder' });
          return new Response(JSON.stringify({ error: 'Não é permitido resetar a senha de outros administradores fundadores.' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
          password: newPassword,
        });

        if (updateError) {
          await recordAudit('reset_password', targetUserId, 'failure', { error: updateError.message });
          return new Response(JSON.stringify({ error: 'Falha ao redefinir senha do usuário.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Revoga sessões ativas do usuário alvo para forçar novo login com a nova senha
        try {
          await supabaseAdmin.auth.admin.signOut(targetUserId);
        } catch {
          // Prossegue
        }

        await recordAudit('reset_password', targetUserId, 'success');
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        const targetUserId = String(body.targetUserId || '').trim();

        if (!targetUserId) {
          return new Response(JSON.stringify({ error: 'Identificador do usuário alvo é obrigatório.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (FOUNDER_IDS.has(targetUserId)) {
          await recordAudit('delete_user', targetUserId, 'failure', { reason: 'cannot_delete_founder' });
          return new Response(JSON.stringify({ error: 'As contas fundadoras são fixas e não podem ser excluídas.' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        await supabaseAdmin.from('admin_users').delete().eq('user_id', targetUserId);
        const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

        if (delError) {
          await recordAudit('delete_user', targetUserId, 'failure', { error: delError.message });
          return new Response(JSON.stringify({ error: 'Erro ao excluir usuário na base de autenticação.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        await recordAudit('delete_user', targetUserId, 'success');
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'revoke_sessions': {
        const targetUserId = String(body.targetUserId || '').trim();
        if (!targetUserId) {
          return new Response(JSON.stringify({ error: 'Identificador do usuário alvo é obrigatório.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        await supabaseAdmin.auth.admin.signOut(targetUserId);
        await recordAudit('revoke_sessions', targetUserId, 'success');
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Ação não reconhecida.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Erro interno ao processar requisição.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
