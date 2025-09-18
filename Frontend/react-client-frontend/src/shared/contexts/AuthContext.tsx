import { createContext } from 'react';
import type { Client } from '../types/client';

export interface AuthContextType {
  user: Client | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<Client, 'id'>) => Promise<Client>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);