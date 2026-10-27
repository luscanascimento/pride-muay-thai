import React, { useState, useEffect, useCallback } from 'react';
import { authService, AdminSession } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';
import { AuthContext, AuthContextValue } from './authContextDef';

export { type AuthContextValue } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Restaura sessão existente ao carregar a página
    authService
      .getCurrentAdmin()
      .then((activeSession) => {
        if (!isMounted) return;
        setSession(activeSession);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Erro ao verificar sessão administrativa:', err);
        setSession(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    // Ouvinte em tempo real de mudanças de auth
    const sub = authService.onAuthStateChange((nextSession) => {
      if (isMounted) {
        setSession(nextSession);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      sub.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const adminSession = await authService.signIn(email, password);
      setSession(adminSession);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'E-mail ou senha inválidos.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    session,
    isLoading,
    error,
    isAdmin: Boolean(session?.adminUser?.user_id),
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
