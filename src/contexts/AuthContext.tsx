
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'superuser' | 'admin' | 'evaluator' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  displayName?: string;
  phoneNumber?: string;
}

export interface PendingUser extends Omit<User, 'id'> {
  id: string;
  password: string;
  status: 'pending';
  requestDate: Date;
}

interface UserRegistration {
  displayName: string;
  username: string;
  email: string;
  role: UserRole;
  password: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  pendingUsers: PendingUser[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (user: UserRegistration) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
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

// Initialize some mock pending users
const INITIAL_PENDING_USERS: PendingUser[] = [
  {
    id: '101',
    username: 'newadmin',
    email: 'new.admin@mentalhealthiq.com',
    password: 'password123',
    role: 'admin' as UserRole,
    displayName: 'New Admin',
    phoneNumber: '+1 (555) 123-4567',
    status: 'pending',
    requestDate: new Date('2023-09-15')
  },
  {
    id: '102',
    username: 'newevaluator',
    email: 'new.evaluator@mentalhealthiq.com',
    password: 'password123',
    role: 'evaluator' as UserRole,
    displayName: 'New Evaluator',
    phoneNumber: '+1 (555) 987-6543',
    status: 'pending',
    requestDate: new Date('2023-09-16')
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mentalhealthiq_user');
    const storedPendingUsers = localStorage.getItem('mentalhealthiq_pending_users');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('mentalhealthiq_user');
      }
    }
    
    if (storedPendingUsers) {
      try {
        const parsedPendingUsers = JSON.parse(storedPendingUsers);
        setPendingUsers(parsedPendingUsers);
      } catch (error) {
        console.error('Failed to parse stored pending users:', error);
        localStorage.removeItem('mentalhealthiq_pending_users');
        setPendingUsers(INITIAL_PENDING_USERS);
      }
    } else {
      // Initialize with mock pending users if none are stored
      setPendingUsers(INITIAL_PENDING_USERS);
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

  const registerUser = async (userData: UserRegistration) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username or email already exists
    const usernameExists = [...MOCK_USERS, ...pendingUsers].some(u => u.username === userData.username);
    if (usernameExists) {
      setIsLoading(false);
      throw new Error('Username is already taken');
    }
    
    const emailExists = [...MOCK_USERS, ...pendingUsers].some(u => u.email === userData.email);
    if (emailExists) {
      setIsLoading(false);
      throw new Error('Email is already registered');
    }
    
    // Create new pending user
    const newPendingUser: PendingUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      displayName: userData.displayName,
      phoneNumber: userData.phoneNumber,
      status: 'pending',
      requestDate: new Date()
    };
    
    const updatedPendingUsers = [...pendingUsers, newPendingUser];
    setPendingUsers(updatedPendingUsers);
    localStorage.setItem('mentalhealthiq_pending_users', JSON.stringify(updatedPendingUsers));
    
    setIsLoading(false);
  };

  const approveUser = async (userId: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userToApprove = pendingUsers.find(u => u.id === userId);
    if (!userToApprove) {
      setIsLoading(false);
      throw new Error('User not found');
    }
    
    // Add to mock users (in a real app, this would be a database operation)
    const { password, status, requestDate, ...userWithoutPendingFields } = userToApprove;
    MOCK_USERS.push({
      ...userWithoutPendingFields,
      password // In a real app, this would be hashed
    });
    
    // Remove from pending users
    const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
    setPendingUsers(updatedPendingUsers);
    localStorage.setItem('mentalhealthiq_pending_users', JSON.stringify(updatedPendingUsers));
    
    setIsLoading(false);
  };

  const rejectUser = async (userId: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simply remove from pending users
    const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
    setPendingUsers(updatedPendingUsers);
    localStorage.setItem('mentalhealthiq_pending_users', JSON.stringify(updatedPendingUsers));
    
    setIsLoading(false);
  };

  const value = {
    user,
    pendingUsers,
    login,
    logout,
    registerUser,
    approveUser,
    rejectUser,
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
