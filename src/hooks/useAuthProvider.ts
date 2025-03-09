
import { useState, useEffect } from 'react';
import { User, PendingUser, UserRegistration } from '../types/auth';
import authService from '../services/authService';

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get user from localStorage first for quick UI rendering
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
    
    // Then verify the token with the backend
    const verifyToken = async () => {
      try {
        // Only call API if we have a token
        if (localStorage.getItem('mentalhealthiq_token')) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('mentalhealthiq_user', JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error('Failed to verify token:', error);
        // Clear invalid token
        localStorage.removeItem('mentalhealthiq_token');
        localStorage.removeItem('mentalhealthiq_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    try {
      const userResponse = await authService.login(username, password);
      setUser(userResponse);
      localStorage.setItem('mentalhealthiq_user', JSON.stringify(userResponse));
      return userResponse;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('mentalhealthiq_user');
      localStorage.removeItem('mentalhealthiq_token');
      setIsLoading(false);
    }
  };

  const registerUser = async (userData: UserRegistration): Promise<PendingUser> => {
    setIsLoading(true);
    
    try {
      const response = await authService.register(userData);
      
      // Convert the response to match our PendingUser type
      const pendingUser: PendingUser = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        password: userData.password, // This would typically not be returned from the API
        role: response.user.role,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
        status: 'pending',
        requestDate: new Date()
      };
      
      // Update pending users list if we're an admin
      if (user?.role === 'admin' || user?.role === 'superuser') {
        setPendingUsers([...pendingUsers, pendingUser]);
      }
      
      return pendingUser;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    setIsLoading(true);
    
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem('mentalhealthiq_user', JSON.stringify(updatedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingUsers = async (): Promise<void> => {
    // Only admins can see pending users
    if (user?.role !== 'admin' && user?.role !== 'superuser') {
      return;
    }
    
    setIsLoading(true);
    try {
      const pendingUsersList = await authService.getPendingUsers();
      setPendingUsers(pendingUsersList);
    } catch (error) {
      console.error('Failed to load pending users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (userId: string): Promise<PendingUser> => {
    setIsLoading(true);
    
    try {
      const approvedUser = await authService.approveUser(userId);
      
      // Remove from pending list
      const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
      setPendingUsers(updatedPendingUsers);
      
      return approvedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectUser = async (userId: string): Promise<PendingUser> => {
    setIsLoading(true);
    
    try {
      const rejectedUser = await authService.rejectUser(userId);
      
      // Remove from pending list
      const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
      setPendingUsers(updatedPendingUsers);
      
      return rejectedUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Load pending users if we're an admin
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'superuser') {
      loadPendingUsers();
    }
  }, [user?.role]);

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
