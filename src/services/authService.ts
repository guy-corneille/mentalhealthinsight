
import api from './api';
import { User, UserRegistration, PendingUser } from '../types/auth';

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

const authService = {
  login: async (username: string, password: string): Promise<User> => {
    try {
      // Django REST Framework's token auth expects username and password
      const response = await api.post<LoginResponse>('/users/login/', { username, password });
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('mentalhealthiq_token', response.token);
        
        // If user info is returned with the token, use it
        if (response.user) {
          localStorage.setItem('mentalhealthiq_user', JSON.stringify(response.user));
          return response.user;
        }
        
        // Otherwise, fetch user details
        const userResponse = await api.get<User>('/users/me/');
        localStorage.setItem('mentalhealthiq_user', JSON.stringify(userResponse));
        return userResponse;
      } else {
        throw new Error('No authentication token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: UserRegistration): Promise<RegisterResponse> => {
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
  getPendingUsers: async (): Promise<PendingUser[]> => {
    return await api.get<PendingUser[]>('/pending-users/');
  },
  
  approveUser: async (userId: string): Promise<PendingUser> => {
    return await api.post<PendingUser>(`/pending-users/${userId}/approve/`);
  },
  
  rejectUser: async (userId: string): Promise<PendingUser> => {
    return await api.post<PendingUser>(`/pending-users/${userId}/reject/`);
  }
};

export default authService;
