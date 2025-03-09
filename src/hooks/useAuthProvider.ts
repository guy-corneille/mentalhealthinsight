
import { useState, useEffect } from 'react';
import { User, PendingUser, UserRegistration } from '../types/auth';
import { MOCK_USERS, INITIAL_PENDING_USERS } from '../data/mockUsers';

export function useAuthProvider() {
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

  const login = async (username: string, password: string): Promise<User> => {
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
      
      return userWithoutPassword;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mentalhealthiq_user');
  };

  const registerUser = async (userData: UserRegistration): Promise<PendingUser> => {
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
      
      return newPendingUser;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        throw new Error('No user is logged in');
      }
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('mentalhealthiq_user', JSON.stringify(updatedUser));
      
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        const { password } = MOCK_USERS[userIndex];
        MOCK_USERS[userIndex] = { 
          ...updatedUser, 
          password,
          displayName: updatedUser.displayName || updatedUser.username
        } as typeof MOCK_USERS[0];
      }
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (userId: string): Promise<PendingUser> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userToApprove = pendingUsers.find(u => u.id === userId);
      if (!userToApprove) {
        throw new Error('User not found');
      }
      
      const { password, status, requestDate, ...userWithoutPendingFields } = userToApprove;
      
      const displayName = userWithoutPendingFields.displayName || userWithoutPendingFields.username;
      
      MOCK_USERS.push({
        ...userWithoutPendingFields,
        displayName,
        password
      } as typeof MOCK_USERS[0]);
      
      const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
      setPendingUsers(updatedPendingUsers);
      localStorage.setItem('mentalhealthiq_pending_users', JSON.stringify(updatedPendingUsers));
      
      return userToApprove;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectUser = async (userId: string): Promise<PendingUser> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userToReject = pendingUsers.find(u => u.id === userId);
      if (!userToReject) {
        throw new Error('User not found');
      }
      
      const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
      setPendingUsers(updatedPendingUsers);
      localStorage.setItem('mentalhealthiq_pending_users', JSON.stringify(updatedPendingUsers));
      
      return userToReject;
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
}
