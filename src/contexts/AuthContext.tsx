
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'superuser' | 'admin' | 'auditor' | 'clinician' | 'viewer';

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

// Mock user data - In a real app, this would come from an API/backend
const MOCK_USERS = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john.doe@mentalhealthiq.com',
    password: 'password123', // In a real app, passwords would be hashed and stored securely
    role: 'superuser' as UserRole,
    displayName: 'John Doe'
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane.doe@mentalhealthiq.com',
    password: 'password123',
    role: 'admin' as UserRole,
    displayName: 'Jane Doe'
  },
  {
    id: '3',
    username: 'auditor',
    email: 'auditor@mentalhealthiq.com',
    password: 'password123',
    role: 'auditor' as UserRole,
    displayName: 'Sam Auditor'
  },
  {
    id: '4',
    username: 'clinician',
    email: 'clinician@mentalhealthiq.com',
    password: 'password123',
    role: 'clinician' as UserRole,
    displayName: 'Dr. Smith'
  },
  {
    id: '5',
    username: 'viewer',
    email: 'viewer@mentalhealthiq.com',
    password: 'password123',
    role: 'viewer' as UserRole,
    displayName: 'Alex Viewer'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on mount
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
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid username or password');
    }
    
    // Create user object without password
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    
    // Store in localStorage
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
