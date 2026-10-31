import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbAdminUser } from '../types/database';
import { isInitialSuperAdmin } from '../utils/superAdmins';

export type AdminRole = 'super_admin' | 'admin';

export interface AdminSession {
  user: {
    id: string;
    email?: string;
    aal?: 'aal1' | 'aal2';
  };
  adminUser: DbAdminUser;
  role: AdminRole;
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
      throw new Error(authError?.message || 'Falha ao autenticar.');
    }

    // Valida se o usuário autenticado está na tabela admin_users
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id, display_name, email, role, created_at')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (adminError || !adminData) {
      // Usuário autenticou no Auth mas não é administrador: encerra a sessão
      await supabase.auth.signOut();
      throw new Error('Acesso negado: este usuário não possui permissão de administrador.');
    }

    const role: AdminRole =
      adminData.role === 'super_admin' || isInitialSuperAdmin(authData.user.id)
        ? 'super_admin'
        : 'admin';

    // Checa nível de AAL
    let aal: 'aal1' | 'aal2' = 'aal1';
    try {
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel === 'aal2') aal = 'aal2';
    } catch {
      // MFA opcional
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        aal,
      },
      adminUser: adminData,
      role,
    };
  },

  /**
   * Encerra a sessão ativa
   */
  async signOut(): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[authService] Erro ao encerrar sessão:', err);
    }
  },

  /**
   * Altera a senha do próprio usuário logado (mínimo 12 caracteres)
   */
  async changeOwnPassword(newPassword: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }
    if (!newPassword || newPassword.length < 12) {
      throw new Error('A nova senha deve possuir pelo menos 12 caracteres.');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(`Erro ao alterar senha: ${error.message}`);
    }
  },

  /**
   * Obtém o administrador atual validando a identidade via getUser() no servidor Supabase
   */
  async getCurrentAdmin(): Promise<AdminSession | null> {
    if (!isSupabaseConfigured) return null;

    // Utiliza getUser() para validação de identidade real com a auth API
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const currentUser = userData?.user;

    if (userError || !currentUser) {
      return null;
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id, display_name, email, role, created_at')
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (adminError || !adminData) {
      // Se não constar mais em admin_users (ex: removido por fundador), invalida a sessão
      await supabase.auth.signOut();
      return null;
    }

    const role: AdminRole =
      adminData.role === 'super_admin' || isInitialSuperAdmin(currentUser.id)
        ? 'super_admin'
        : 'admin';

    let aal: 'aal1' | 'aal2' = 'aal1';
    try {
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel === 'aal2') aal = 'aal2';
    } catch {
      // MFA opcional
    }

    return {
      user: {
        id: currentUser.id,
        email: currentUser.email,
        aal,
      },
      adminUser: adminData,
      role,
    };
  },

  /**
   * Registra listener para mudanças na sessão do Supabase Auth
   */
  onAuthStateChange(callback: (session: AdminSession | null) => void) {
    if (!isSupabaseConfigured) {
      return { unsubscribe: () => {} };
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        callback(null);
        return;
      }

      // Validação do registro de admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('user_id, display_name, email, role, created_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!adminData) {
        callback(null);
      } else {
        const role: AdminRole =
          adminData.role === 'super_admin' || isInitialSuperAdmin(session.user.id)
            ? 'super_admin'
            : 'admin';

        callback({
          user: {
            id: session.user.id,
            email: session.user.email,
            aal: 'aal1',
          },
          adminUser: adminData,
          role,
        });
      }
    });

    return {
      unsubscribe: () => listener.subscription.unsubscribe(),
    };
  },

  // ============================================================================
  // Preparação para MFA / TOTP (Multi-Factor Authentication)
  // ============================================================================

  /**
   * Obtém os níveis de AAL (currentLevel e nextLevel)
   */
  async getMfaAssuranceLevel(): Promise<{ currentLevel: string | null; nextLevel: string | null }> {
    if (!isSupabaseConfigured) return { currentLevel: null, nextLevel: null };
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error || !data) return { currentLevel: null, nextLevel: null };
    return {
      currentLevel: data.currentLevel,
      nextLevel: data.nextLevel,
    };
  },

  /**
   * Inicia o fluxo de matrícula TOTP gerando QR code e segredo
   */
  async enrollTotpFactor(): Promise<{ id: string; qrCode: string; secret: string; uri: string }> {
    if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error || !data) {
      throw new Error(error?.message || 'Falha ao iniciar matrícula de autenticação de dois fatores.');
    }
    return {
      id: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    };
  },

  /**
   * Valida o desafio de verificação TOTP e eleva a sessão para AAL2
   */
  async verifyTotpFactor(factorId: string, code: string): Promise<boolean> {
    if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError || !challenge) {
      throw new Error(challengeError?.message || 'Falha ao gerar desafio MFA.');
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });

    if (verifyError) {
      throw new Error(verifyError.message || 'Código de verificação de dois fatores inválido.');
    }

    return true;
  },

  /**
   * Lista os fatores MFA ativos do usuário
   */
  async listTotpFactors() {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error || !data) return [];
    return data.totp || [];
  },
};
