
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
      console.log('Making login request with:', { username });
      
      // Development mode - bypass actual API authentication
      // Determine role based on username for demo purposes
      let role: 'superuser' | 'admin' | 'evaluator' | 'viewer' = 'viewer';
      
      if (username === 'admin') {
        role = 'admin';
      } else if (username === 'evaluator') {
        role = 'evaluator';
      } else if (username === 'super') {
        role = 'superuser';
      }
      
      // In development mode, create a mock token and user
      const mockToken = "dev_token_" + Math.random().toString(36).substring(2);
      localStorage.setItem('mentalhealthiq_token', mockToken);
      
      // Create a basic user object
      const user: User = {
        id: username + '_id',
        username: username,
        email: `${username}@example.com`,
        role: role,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        dateJoined: new Date()
      };
      
      localStorage.setItem('mentalhealthiq_user', JSON.stringify(user));
      console.log('Development login created user:', user);
      return user;
      
      /* Real API authentication code - commented out for now
      // Send credentials to our custom login endpoint
      const response = await api.post<LoginResponse>('/users/login/', { 
        username, 
        password 
      });
      
      console.log('Login response received:', response);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('mentalhealthiq_token', response.token);
        
        // If user info is returned with the token, use it
        if (response.user) {
          localStorage.setItem('mentalhealthiq_user', JSON.stringify(response.user));
          return response.user;
        }
        
        // Otherwise, fetch user details
        try {
          const userResponse = await api.get<User>('/users/me/');
          localStorage.setItem('mentalhealthiq_user', JSON.stringify(userResponse));
          return userResponse;
        } catch (error) {
          console.error('Error fetching user details:', error);
          // If we can't get user details, construct a basic user object
          const basicUser: User = {
            id: 'unknown',
            username: username,
            email: '',
            role: 'viewer', // Using 'viewer' which is a valid UserRole
            displayName: username
          };
          localStorage.setItem('mentalhealthiq_user', JSON.stringify(basicUser));
          return basicUser;
        }
      } else {
        throw new Error('No authentication token received');
      }
      */
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
