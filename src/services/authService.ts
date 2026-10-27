import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbAdminUser } from '../types/database';

export interface AdminSession {
  user: {
    id: string;
    email?: string;
  };
  adminUser: DbAdminUser;
}

export const authService = {
  /**
   * Realiza login com e-mail e senha no Supabase Auth
   */
  async signIn(email: string, password: string): Promise<AdminSession> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não está configurado. Verifique as variáveis de ambiente.');
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'E-mail ou senha inválidos.');
    }

    // Conferir autorização estrita na tabela admin_users
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id, display_name, created_at')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (adminError || !adminData) {
      // Usuário autenticado, mas NÃO consta na lista de administradores autorizados
      await supabase.auth.signOut();
      throw new Error('Acesso negado: Este usuário não possui privilégios de administrador.');
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      adminUser: adminData,
    };
  },

  /**
   * Encerra a sessão ativa
   */
  async signOut(): Promise<void> {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  },

  /**
   * Obtém a sessão atual e verifica o perfil do administrador
   */
  async getCurrentAdmin(): Promise<AdminSession | null> {
    if (!isSupabaseConfigured) return null;

    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;

    if (!currentUser) {
      return null;
    }

    const { data: adminData, error } = await supabase
      .from('admin_users')
      .select('user_id, display_name, created_at')
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (error || !adminData) {
      // Se não for admin, encerra a sessão Supabase para não manter tokens pendentes
      await supabase.auth.signOut();
      return null;
    }

    return {
      user: {
        id: currentUser.id,
        email: currentUser.email,
      },
      adminUser: adminData,
    };
  },

  /**
   * Registra listener para mudanças na sessão
   */
  onAuthStateChange(callback: (session: AdminSession | null) => void) {
    if (!isSupabaseConfigured) {
      return { unsubscribe: () => {} };
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('user_id, display_name, created_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!adminData) {
        callback(null);
      } else {
        callback({
          user: {
            id: session.user.id,
            email: session.user.email,
          },
          adminUser: adminData,
        });
      }
    });

    return {
      unsubscribe: () => listener.subscription.unsubscribe(),
    };
  },
};
