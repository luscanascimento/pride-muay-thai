import React, { useState, useEffect, useCallback, useRef } from 'react';
import { authService, AdminSession, AdminRole } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';
import { AuthContext, AuthContextValue } from './authContextDef';
import { navigateTo } from '../utils/routes';

export { type AuthContextValue } from './authContextDef';

// Timeout padrão de inatividade: 30 minutos (configurável via env VITE_ADMIN_INACTIVITY_TIMEOUT_MINUTES)
const DEFAULT_INACTIVITY_MINUTES = 30;
const envTimeout = Number(import.meta.env?.VITE_ADMIN_INACTIVITY_TIMEOUT_MINUTES);
const INACTIVITY_TIMEOUT_MS =
  (!isNaN(envTimeout) && envTimeout > 0 ? envTimeout : DEFAULT_INACTIVITY_MINUTES) * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthError = useCallback(
    (err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes('401') ||
        msg.includes('403') ||
        msg.includes('JWT') ||
        msg.includes('permission denied') ||
        msg.includes('Não autorizado') ||
        msg.includes('Unauthorized')
      ) {
        console.warn('[AuthProvider] Erro de autorização detectado, limpando sessão:', msg);
        signOut();
        navigateTo('/admin/login');
      }
    },
    [signOut]
  );

  // Gerenciamento de Sessão e Listener Real-Time
  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      setIsInitialLoading(false);
      return;
    }

    // 1. Restauração com validação de identidade real (getUser)
    authService
      .getCurrentAdmin()
      .then((activeSession) => {
        if (!isMounted) return;
        setSession(activeSession);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('[AuthProvider] Falha na restauração da sessão:', err);
        setSession(null);
      })
      .finally(() => {
        if (isMounted) setIsInitialLoading(false);
      });

    // 2. Ouvinte de estado de autenticação (trata login, logout cross-tab, token refresh)
    const sub = authService.onAuthStateChange((nextSession) => {
      if (isMounted) {
        setSession(nextSession);
        setIsInitialLoading(false);
      }
    });

    return () => {
      isMounted = false;
      sub.unsubscribe();
    };
  }, []);

  // Monitoramento de Timeout de Inatividade (quando administrador está logado)
  useEffect(() => {
    if (!session) {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    lastActivityRef.current = Date.now();

    const recordActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }));

    inactivityTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        console.warn('[AuthProvider] Sessão administrativa encerrada por inatividade.');
        signOut();
        navigateTo('/admin/login');
      }
    }, 15000); // Checa a cada 15 segundos

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, recordActivity));
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [session, signOut]);

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

  const role: AdminRole | null = session?.role || null;
  const isSuperAdmin = role === 'super_admin';

  const value: AuthContextValue = {
    session,
    isLoading,
    isInitialLoading,
    error,
    isAdmin: Boolean(session?.adminUser?.user_id),
    isSuperAdmin,
    role,
    signIn,
    signOut,
    handleAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
