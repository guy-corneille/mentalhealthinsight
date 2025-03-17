
import { useState, useEffect } from 'react';
import { User, PendingUser, UserRegistration } from '../types/auth';
import authService from '../services/authService';
import { useToast } from '@/hooks/use-toast';

export function useAuthProvider() {
  // State for storing the current user, pending users awaiting approval, and loading state
  const [user, setUser] = useState<User | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user data is stored in localStorage when component mounts
    const storedUser = localStorage.getItem('mentalhealthiq_user');
    
    if (storedUser) {
      try {
        // Parse and set stored user if available
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('mentalhealthiq_user');
      }
    }
    
    const verifyToken = async () => {
      try {
        // Verify the token if it exists in localStorage
        if (localStorage.getItem('mentalhealthiq_token')) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('mentalhealthiq_user', JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error('Failed to verify token:', error);
        localStorage.removeItem('mentalhealthiq_token');
        localStorage.removeItem('mentalhealthiq_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Login function - fixed to only pass username as per authService update
  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    try {
      // Call authService.login with just the username parameter
      const userResponse = await authService.login(username);
      setUser(userResponse);
      localStorage.setItem('mentalhealthiq_user', JSON.stringify(userResponse));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return userResponse;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Login failed';
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMsg,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
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
      
      toast({
        title: "Registration Successful",
        description: "Your account is pending approval from an administrator.",
      });
      
      const pendingUser: PendingUser = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: response.user.role as any,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
        status: 'pending',
        requestDate: new Date()
      };
      
      if (user?.role === 'admin' || user?.role === 'superuser') {
        setPendingUsers([...pendingUsers, pendingUser]);
      }
      
      return pendingUser;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Registration failed';
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMsg,
      });
      throw error;
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
      
      const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
      setPendingUsers(updatedPendingUsers);
      
      return rejectedUser;
    } finally {
      setIsLoading(false);
    }
  };

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
