
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '../types/auth';
import { useAuthProvider } from '../hooks/useAuthProvider';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-export types from types/auth.ts
export type { User, UserRole, PendingUser } from '../types/auth';
