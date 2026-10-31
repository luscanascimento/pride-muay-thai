import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbAdminUser } from '../types/database';
import {
  isInitialSuperAdmin,
  canResetUserPassword,
  canDeleteUser,
} from '../utils/superAdmins';

export interface CreateAdminUserInput {
  email: string;
  password: string;
  displayName: string;
}

export const userService = {
  /**
   * Lista todos os administradores cadastrados
   */
  async listAdminUsers(): Promise<DbAdminUser[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Erro ao listar administradores: ${error.message}`);
    }

    return (data || []) as DbAdminUser[];
  },

  /**
   * Cria um novo usuário administrador (apenas para super admins fundadores)
   */
  async createAdminUser(
    currentUserId: string,
    input: CreateAdminUserInput
  ): Promise<{ user_id: string; email: string; display_name: string }> {
    if (!isInitialSuperAdmin(currentUserId)) {
      throw new Error('Apenas os administradores fundadores possuem permissão para criar usuários.');
    }

    const email = input.email.trim().toLowerCase();
    const password = input.password;
    const displayName = input.displayName.trim();

    if (!email || !email.includes('@')) {
      throw new Error('Informe um e-mail válido.');
    }
    if (!password || password.length < 12) {
      throw new Error('A senha deve ter pelo menos 12 caracteres.');
    }
    if (!displayName) {
      throw new Error('Informe o nome de exibição do usuário.');
    }

    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    // 1. Tentar via Edge Function server-side (service_role isolada em backend)
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'create',
          email,
          password,
          displayName,
        },
      });

      if (!edgeError && edgeData && edgeData.user_id) {
        return edgeData as { user_id: string; email: string; display_name: string };
      }
      if (edgeError && !edgeError.message.includes('Failed to send') && !edgeError.message.includes('404')) {
        throw new Error(edgeData?.error || edgeError.message);
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        !err.message.includes('Failed to send') &&
        !err.message.includes('FunctionsFetchError') &&
        !err.message.includes('404')
      ) {
        throw err;
      }
    }

    // 2. Transição segura: invoca RPC segura com validação no PostgreSQL
    const { data: rpcData, error: rpcError } = await supabase.rpc('admin_create_user', {
      new_email: email,
      new_password: password,
      new_display_name: displayName,
    });

    if (rpcError) {
      throw new Error(`Erro ao cadastrar novo usuário: ${rpcError.message}`);
    }

    if (!rpcData) {
      throw new Error('Falha ao cadastrar novo usuário.');
    }

    return rpcData as unknown as { user_id: string; email: string; display_name: string };
  },

  /**
   * Reseta a senha de um usuário existente (apenas por super admins fundadores e NUNCA entre si)
   */
  async resetUserPassword(
    currentUserId: string,
    targetUserId: string,
    newPassword: string
  ): Promise<void> {
    if (!canResetUserPassword(currentUserId, targetUserId)) {
      throw new Error(
        'Permissão negada: as contas dos fundadores são fixas e não podem ter a senha alterada por outros administradores.'
      );
    }

    if (!newPassword || newPassword.length < 12) {
      throw new Error('A nova senha deve possuir pelo menos 12 caracteres.');
    }

    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    // 1. Tentar via Edge Function server-side
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'reset_password',
          targetUserId,
          newPassword,
        },
      });

      if (!edgeError && edgeData?.success) {
        return;
      }
      if (edgeError && !edgeError.message.includes('Failed to send') && !edgeError.message.includes('404')) {
        throw new Error(edgeData?.error || edgeError.message);
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        !err.message.includes('Failed to send') &&
        !err.message.includes('FunctionsFetchError') &&
        !err.message.includes('404')
      ) {
        throw err;
      }
    }

    // 2. Transição segura: RPC segura com validação no PostgreSQL
    const { error } = await supabase.rpc('admin_reset_user_password', {
      target_user_id: targetUserId,
      new_password: newPassword,
    });

    if (error) {
      throw new Error(`Erro ao redefinir senha do usuário: ${error.message}`);
    }
  },

  /**
   * Remove acesso administrativo de um usuário (apenas por fundadores e NUNCA contas fundadoras)
   */
  async deleteAdminUser(currentUserId: string, targetUserId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    if (!canDeleteUser(currentUserId, targetUserId)) {
      throw new Error(
        'Permissão negada: contas fundadoras são fixas e protegidas contra exclusão.'
      );
    }

    // 1. Tentar via Edge Function server-side
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'delete',
          targetUserId,
        },
      });

      if (!edgeError && edgeData?.success) {
        return;
      }
      if (edgeError && !edgeError.message.includes('Failed to send') && !edgeError.message.includes('404')) {
        throw new Error(edgeData?.error || edgeError.message);
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        !err.message.includes('Failed to send') &&
        !err.message.includes('FunctionsFetchError') &&
        !err.message.includes('404')
      ) {
        throw err;
      }
    }

    // 2. Transição segura: RPC no banco
    const { error: rpcError } = await supabase.rpc('admin_delete_user', {
      target_user_id: targetUserId,
    });

    if (rpcError) {
      throw new Error(`Erro ao excluir usuário: ${rpcError.message}`);
    }
  },
};
