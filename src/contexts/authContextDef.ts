import { createContext } from 'react';
import { AdminSession, AdminRole } from '../services/authService';

export interface AuthContextValue {
  session: AdminSession | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: AdminRole | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  handleAuthError: (error: unknown) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
