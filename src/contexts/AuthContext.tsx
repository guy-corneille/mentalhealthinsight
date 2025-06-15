import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import api from '@/services/api';

export type UserRole = 'viewer' | 'evaluator' | 'admin' | 'superuser';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  display_name?: string;
  phone_number?: string;
  is_active: boolean;
  date_joined: string;
}

export interface PendingUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  display_name?: string;
  phone_number?: string;
  status: 'pending' | 'approved' | 'rejected';
  request_date: string;
}

interface AuthResponse {
  user: User;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingUsers: PendingUser[];
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (userData: Omit<PendingUser, 'id' | 'status' | 'request_date'>) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  fetchPendingUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  const checkAuth = useCallback(async () => {
    try {
      // Always set authenticated state to true and use dummy user
      setUser({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
        display_name: 'Test User',
        is_active: true,
        date_joined: new Date().toISOString()
      });
      setIsAuthenticated(true);
    } catch (error) {
      // Even on error, keep user authenticated
      setUser({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
        display_name: 'Test User',
        is_active: true,
        date_joined: new Date().toISOString()
      });
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const data = await api.post<AuthResponse>('/auth/login/', { username, password });
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout/');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (userData: Omit<PendingUser, 'id' | 'status' | 'request_date'>) => {
    await api.post('/auth/register/', userData);
  }, []);

  const fetchPendingUsers = useCallback(async () => {
    if (user?.role === 'admin' || user?.role === 'superuser') {
      try {
        const { data } = await api.get<AxiosResponse<PendingUser[]>>('/auth/pending-users/');
        setPendingUsers(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching pending users:', error.response?.data);
        }
      }
    }
  }, [user?.role]);

  const approveUser = useCallback(async (userId: string) => {
    await api.post(`/auth/approve-user/${userId}/`);
    await fetchPendingUsers();
  }, [fetchPendingUsers]);

  const rejectUser = useCallback(async (userId: string) => {
    await api.post(`/auth/reject-user/${userId}/`);
    await fetchPendingUsers();
  }, [fetchPendingUsers]);

  const initAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      await checkAuth();
    } finally {
      setIsLoading(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        pendingUsers,
        login,
        logout,
        register,
        approveUser,
        rejectUser,
        fetchPendingUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
