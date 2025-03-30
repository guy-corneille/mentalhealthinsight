
/**
 * Authentication Service
 * 
 * This service handles user authentication, registration, and profile management.
 * It provides mock implementations for authentication operations since
 * real authentication has been disabled.
 */
import api from '@/core/services/api';
import { User, UserRegistration, PendingUser } from '@/types/auth';

// Types for API responses
interface LoginResponse {
  token: string;
  user?: User;
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    status: string;
  };
}

// This is the authentication service
// It handles user authentication, registration, and profile management
// Note: Authentication has been disabled - this now returns mock data
const authService = {
  // Login function - would typically authenticate with the backend
  // Now simply returns a mock user without making an API call
  login: async (username: string): Promise<User> => {
    console.log('Mock login with:', { username });
    
    // Return mock user data - no actual API call
    const mockUser: User = {
      id: "mock-user-id",
      username: username || "demo-user",
      email: "demo@example.com",
      role: "admin", // Admin role to access everything
      displayName: username || "Demo User",
      dateJoined: new Date()
    };
    
    // Store mock data in localStorage to maintain some state
    localStorage.setItem('mentalhealthiq_token', 'mock-token-value');
    localStorage.setItem('mentalhealthiq_user', JSON.stringify(mockUser));
    
    return mockUser;
  },
  
  // Registration function - would typically create a new user in the backend
  // Now returns mock data without making an API call
  register: async (userData: UserRegistration): Promise<RegisterResponse> => {
    console.log('Mock registration with:', userData);
    
    // Return a mock response - no actual API call
    return {
      message: 'Registration successful. Your account is pending approval.',
      user: {
        id: "mock-pending-user-id",
        username: userData.username,
        email: userData.email,
        role: userData.role,
        status: 'pending'
      }
    };
  },
  
  // Logout function - would typically invalidate the token on the backend
  // Now simply clears local storage
  logout: async (): Promise<void> => {
    console.log('Mock logout');
    
    // Just clear local storage - no actual API call
    localStorage.removeItem('mentalhealthiq_token');
    localStorage.removeItem('mentalhealthiq_user');
  },
  
  // Get current user details - would typically fetch from the backend
  // Now returns mock data without making an API call
  getCurrentUser: async (): Promise<User> => {
    console.log('Mock get current user');
    
    // Try to get user from localStorage or return a default mock user
    const storedUser = localStorage.getItem('mentalhealthiq_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // Default mock user
    return {
      id: "mock-user-id",
      username: "demo-user",
      email: "demo@example.com",
      role: "admin",
      displayName: "Demo User",
      dateJoined: new Date()
    };
  },
  
  // Update user profile - would typically update the backend
  // Now returns mock data without making an API call
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    console.log('Mock update profile with:', userData);
    
    // Update the mock user - no actual API call
    const currentUser = await authService.getCurrentUser();
    const updatedUser = { ...currentUser, ...userData };
    
    localStorage.setItem('mentalhealthiq_user', JSON.stringify(updatedUser));
    
    return updatedUser;
  },
  
  // Admin function to get pending users
  // Returns mock data without making an API call
  getPendingUsers: async (): Promise<PendingUser[]> => {
    console.log('Mock get pending users');
    
    // Return mock pending users - no actual API call
    return [
      {
        id: "mock-pending-1",
        username: "pending-user-1",
        email: "pending1@example.com",
        role: "evaluator",
        status: "pending",
        requestDate: new Date()
      },
      {
        id: "mock-pending-2",
        username: "pending-user-2",
        email: "pending2@example.com",
        role: "viewer",
        status: "pending",
        requestDate: new Date()
      }
    ];
  },
  
  // Admin function to approve a pending user
  // Returns mock data without making an API call
  approveUser: async (userId: string): Promise<PendingUser> => {
    console.log('Mock approve user:', userId);
    
    // Return a mock approved user - no actual API call
    return {
      id: userId,
      username: "approved-user",
      email: "approved@example.com",
      role: "evaluator",
      status: "pending", // Still marked pending in the return type but would be approved
      requestDate: new Date()
    };
  },
  
  // Admin function to reject a pending user
  // Returns mock data without making an API call
  rejectUser: async (userId: string): Promise<PendingUser> => {
    console.log('Mock reject user:', userId);
    
    // Return a mock rejected user - no actual API call
    return {
      id: userId,
      username: "rejected-user",
      email: "rejected@example.com",
      role: "viewer",
      status: "pending", // Still marked pending in the return type but would be rejected
      requestDate: new Date()
    };
  }
};

export default authService;
