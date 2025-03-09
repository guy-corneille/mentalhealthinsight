
import api from './api';
import { User, UserRegistration } from '../types/auth';

// Types for API responses
interface LoginResponse {
  token: string;
  user: User;
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

const authService = {
  login: async (username: string, password: string): Promise<User> => {
    const response = await api.post<LoginResponse>('/users/login/', { username, password });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('mentalhealthiq_token', response.token);
    }
    
    return response.user;
  },
  
  register: async (userData: UserRegistration): Promise<any> => {
    return await api.post<RegisterResponse>('/users/register/', userData);
  },
  
  logout: async (): Promise<void> => {
    try {
      await api.post<{message: string}>('/users/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove local token & user data regardless of API success
      localStorage.removeItem('mentalhealthiq_token');
      localStorage.removeItem('mentalhealthiq_user');
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    return await api.get<User>('/users/me/');
  },
  
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return await api.put<User>('/users/me/', userData);
  },
  
  // Admin functions
  getPendingUsers: async (): Promise<any[]> => {
    return await api.get<any[]>('/pending-users/');
  },
  
  approveUser: async (userId: string): Promise<any> => {
    return await api.post<any>(`/pending-users/${userId}/approve/`);
  },
  
  rejectUser: async (userId: string): Promise<any> => {
    return await api.post<any>(`/pending-users/${userId}/reject/`);
  }
};

export default authService;
