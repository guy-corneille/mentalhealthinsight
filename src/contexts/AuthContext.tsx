import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { UserRole } from '@/utils/roleUtils';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  display_name?: string;
  displayName?: string;
  phone_number?: string;
  phoneNumber?: string;
  is_active: boolean;
  isActive?: boolean;
  date_joined: string;
  dateJoined?: string;
}

export interface PendingUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  display_name?: string;
  displayName?: string;
  phone_number?: string;
  phoneNumber?: string;
  password: string;
  status: 'pending' | 'approved' | 'rejected';
  request_date: string;
  requestDate?: string;
  created_at?: string;
  createdAt?: string;
}

interface LoginResponse {
  user: User;
  isAuthenticated: boolean;
}

interface ApprovalResponse {
  user: PendingUser;
  message: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  pendingUsers: PendingUser[];
  systemUsers: User[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<PendingUser, 'id' | 'status' | 'request_date'>) => Promise<void>;
  approveUser: (userId: string) => Promise<PendingUser>;
  rejectUser: (userId: string) => Promise<PendingUser>;
  fetchPendingUsers: () => Promise<void>;
  fetchSystemUsers: () => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [systemUsers, setSystemUsers] = useState<User[]>([]);

  // Check for existing user session on app load
  const checkAuth = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('mentalhealthiq_user');
      const expiresAt = localStorage.getItem('mentalhealthiq_session_expires');
      if (expiresAt && Date.now() > Number(expiresAt)) {
        // Session expired
        localStorage.removeItem('mentalhealthiq_user');
        localStorage.removeItem('mentalhealthiq_session_expires');
      }
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('mentalhealthiq_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simple login function - calls real API
  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/auth/simple-login/', { username, password });
      
      if (response.user && response.isAuthenticated) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('mentalhealthiq_user', JSON.stringify(response.user));
        localStorage.setItem('mentalhealthiq_session_expires', String(Date.now() + 30 * 60 * 1000));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  // Simple logout function - just clear local state
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mentalhealthiq_user');
    localStorage.removeItem('mentalhealthiq_session_expires');
  }, []);

  // Register function
  const register = useCallback(async (userData: Omit<PendingUser, 'id' | 'status' | 'request_date'>) => {
    try {
    await api.post('/auth/register/', userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  // Fetch pending users (admin only)
  const fetchPendingUsers = useCallback(async () => {
    if (user?.role === 'admin' || user?.role === 'superuser') {
      try {
        const response = await api.get<PendingUser[]>('/auth/pending-users/');
        // Convert snake_case keys to camelCase for UI convenience
        const mapped = response.map(u => ({
          ...u,
          displayName: (u as any).display_name ?? u.displayName,
          phoneNumber: (u as any).phone_number ?? u.phoneNumber,
          requestDate: (u as any).request_date ?? u.requestDate,
          createdAt: (u as any).created_at ?? u.createdAt,
        }));
        setPendingUsers(mapped as PendingUser[]);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      }
    }
  }, [user?.role]);

  // Approve user
  const approveUser = useCallback(async (userId: string) => {
    try {
      const user = await api.post<PendingUser>(`/auth/approve-user/${userId}/`);
      await fetchPendingUsers();
      return user;
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  }, [fetchPendingUsers]);

  // Reject user
  const rejectUser = useCallback(async (userId: string) => {
    try {
      const user = await api.post<PendingUser>(`/auth/reject-user/${userId}/`);
      await fetchPendingUsers();
      return user;
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  }, [fetchPendingUsers]);

  // Fetch system users (admin only)
  const fetchSystemUsers = useCallback(async () => {
    if (user?.role === 'admin' || user?.role === 'superuser') {
      try {
        const response = await api.get<User[]>('/auth/system-users/');
        setSystemUsers(response);
      } catch (error) {
        console.error('Error fetching system users:', error);
      }
    }
  }, [user?.role]);

  // Toggle user status (admin only)
  const toggleUserStatus = useCallback(async (userId: string) => {
    try {
      const updated = await api.post<User>(`/auth/toggle-user/${userId}/`);
      await fetchSystemUsers();
      return updated;
    } catch (error) {
      console.error('Error toggling user:', error);
      throw error;
    }
  }, [fetchSystemUsers]);

  // Initialize auth on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch pending users when user changes
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'superuser') {
      fetchPendingUsers();
    }
  }, [user?.role, fetchPendingUsers]);

  // Fetch system users when user changes
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'superuser') {
      fetchSystemUsers();
    }
  }, [user?.role, fetchSystemUsers]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.role === 'admin' || user?.role === 'superuser',
        isLoading,
        pendingUsers,
        systemUsers,
        login,
        logout,
        register,
        approveUser,
        rejectUser,
        fetchPendingUsers,
        fetchSystemUsers,
        toggleUserStatus,
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
