
import React, { createContext, useContext } from 'react';
import { AuthContextType, User, UserRole } from '../types/auth';

// Create a default mock user that will be returned as "authenticated"
const defaultUser: User = {
  id: "mock-user-id",
  username: "demo-user",
  email: "demo@example.com",
  role: "admin", // Give admin role to access all features
  displayName: "Demo User",
  dateJoined: new Date()
};

// Pre-configured auth context - always returns as authenticated with the mock user
const defaultAuthContext: AuthContextType = {
  user: defaultUser,
  pendingUsers: [],
  login: async () => defaultUser, // Always succeeds with the mock user
  logout: () => {}, // No-op function
  registerUser: async () => ({ 
    ...defaultUser, 
    status: 'pending', 
    requestDate: new Date() 
  }),
  approveUser: async () => ({ 
    ...defaultUser, 
    status: 'pending', 
    requestDate: new Date() 
  }),
  rejectUser: async () => ({ 
    ...defaultUser, 
    status: 'pending', 
    requestDate: new Date() 
  }),
  updateProfile: async () => {}, // No-op function
  isAuthenticated: true, // Always authenticated
  isLoading: false // Never loading
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Simplified AuthProvider that just provides the default context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always return the mock authenticated context
  return <AuthContext.Provider value={defaultAuthContext}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Re-export types from types/auth.ts
export type { User, UserRole, PendingUser } from '../types/auth';
