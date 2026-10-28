import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
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
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    if (!isInitialSuperAdmin(currentUserId)) {
      throw new Error('Apenas os administradores fundadores possuem permissão para criar usuários.');
    }

    const email = input.email.trim().toLowerCase();
    const password = input.password;
    const displayName = input.displayName.trim();

    if (!email || !email.includes('@')) {
      throw new Error('Informe um e-mail válido.');
    }
    if (!password || password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }
    if (!displayName) {
      throw new Error('Informe o nome de exibição do usuário.');
    }

    // 1. Tentar criar via RPC seguro no banco de dados
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('admin_create_user', {
        new_email: email,
        new_password: password,
        new_display_name: displayName,
      });

      if (!rpcError && rpcData) {
        return rpcData as unknown as { user_id: string; email: string; display_name: string };
      }
    } catch {
      // Continua para fallback resiliente
    }

    // 2. Fallback resiliente: cria o usuário usando cliente desacoplado (sem alterar a sessão local do admin)
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Credenciais do Supabase indisponíveis.');
    }

    const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data: signUpData, error: signUpError } = await tempClient.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (signUpError || !signUpData.user) {
      throw new Error(`Erro ao cadastrar novo usuário: ${signUpError?.message || 'Falha ao registrar'}`);
    }

    const newUserId = signUpData.user.id;

    // Registra na tabela public.admin_users
    const { error: insertError } = await supabase.from('admin_users').insert({
      user_id: newUserId,
      display_name: displayName,
      email,
      role: 'admin',
    });

    if (insertError) {
      throw new Error(`Usuário criado na autenticação, mas erro ao registrar no painel: ${insertError.message}`);
    }

    return {
      user_id: newUserId,
      email,
      display_name: displayName,
    };
  },

  /**
   * Reseta a senha de um usuário existente (apenas por super admins fundadores e NUNCA entre si)
   */
  async resetUserPassword(
    currentUserId: string,
    targetUserId: string,
    newPassword: string
  ): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    if (!canResetUserPassword(currentUserId, targetUserId)) {
      throw new Error(
        'Permissão negada: as contas dos fundadores são fixas e não podem ter a senha alterada por outros administradores.'
      );
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('A nova senha deve possuir pelo menos 6 caracteres.');
    }

    // Invoca RPC segura com validação no PostgreSQL
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

    // Tentar via RPC
    const { error: rpcError } = await supabase.rpc('admin_delete_user', {
      target_user_id: targetUserId,
    });

    if (rpcError) {
      // Fallback: remove da tabela admin_users
      const { error: deleteError } = await supabase
        .from('admin_users')
        .delete()
        .eq('user_id', targetUserId);

      if (deleteError) {
        throw new Error(`Erro ao excluir usuário: ${deleteError.message}`);
      }
    }
  },
};
