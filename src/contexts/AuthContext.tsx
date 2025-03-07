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
  updateProfile: (userData: Partial<User>) => Promise<void>;
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
      setPendingUsers(INITIAL_PENDING_USERS);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.username === username && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid username or password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      localStorage.setItem('mentalhealthiq_user', JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mentalhealthiq_user');
  };

  const registerUser = async (userData: UserRegistration) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usernameExists = [...MOCK_USERS, ...pendingUsers].some(u => u.username === userData.username);
      if (usernameExists) {
        throw new Error('Username is already taken');
      }
      
      const emailExists = [...MOCK_USERS, ...pendingUsers].some(u => u.email === userData.email);
      if (emailExists) {
        throw new Error('Email is already registered');
      }
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        throw new Error('No user is logged in');
      }
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('mentalhealthiq_user', JSON.stringify(updatedUser));
      
      // Also update the user in the MOCK_USERS array
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        const { password } = MOCK_USERS[userIndex];
        MOCK_USERS[userIndex] = { ...updatedUser, password };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userToApprove = pendingUsers.find(u => u.id === userId);
      if (!userToApprove) {
        throw new Error('User not found');
      }
      
      const { password, status, requestDate, ...userWithoutPendingFields } = userToApprove;
      
      // Ensure displayName is set, using username as fallback
      const displayName = userWithoutPendingFields.displayName || userWithoutPendingFields.username;
      
      MOCK_USERS.push({
        ...userWithoutPendingFields,
        displayName,
        password
      });
      
      const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
      setPendingUsers(updatedPendingUsers);
      localStorage.setItem('mentalhealthiq_pending_users', JSON.stringify(updatedPendingUsers));
    } finally {
      setIsLoading(false);
    }
  };

  const rejectUser = async (userId: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
      setPendingUsers(updatedPendingUsers);
      localStorage.setItem('mentalhealthiq_pending_users', JSON.stringify(updatedPendingUsers));
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    pendingUsers,
    login,
    logout,
    registerUser,
    approveUser,
    rejectUser,
    updateProfile,
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
