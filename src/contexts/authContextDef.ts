import { createContext } from 'react';
import { AdminSession } from '../services/authService';

export interface AuthContextValue {
  session: AdminSession | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
