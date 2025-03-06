import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'superuser' | 'admin' | 'evaluator' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  {
    id: '1',
    username: 'superuser',
    email: 'super.user@mentalhealthiq.com',
    password: 'password123',
    role: 'superuser' as UserRole,
    displayName: 'Super User'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@mentalhealthiq.com',
    password: 'password123',
    role: 'admin' as UserRole,
    displayName: 'Admin User'
  },
  {
    id: '3',
    username: 'evaluator',
    email: 'evaluator@mentalhealthiq.com',
    password: 'password123',
    role: 'evaluator' as UserRole,
    displayName: 'Health Evaluator'
  },
  {
    id: '4',
    username: 'viewer',
    email: 'viewer@mentalhealthiq.com',
    password: 'password123',
    role: 'viewer' as UserRole,
    displayName: 'Viewer User'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mentalhealthiq_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('mentalhealthiq_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid username or password');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    
    localStorage.setItem('mentalhealthiq_user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mentalhealthiq_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
