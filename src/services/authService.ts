
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
      
      // For development: Skip actual API call and create a mock user
      // This will bypass backend authentication temporarily
      
      console.log('Using development login mode - bypassing API authentication');
      
      // Create a basic user object for development
      const basicUser: User = {
        id: username, // Using username as ID for simplicity
        username: username,
        email: `${username}@example.com`,
        role: username === 'admin' ? 'admin' : 
              username === 'evaluator' ? 'evaluator' :
              username === 'superuser' ? 'superuser' : 'viewer',
        displayName: username.charAt(0).toUpperCase() + username.slice(1), // Capitalize first letter
        phoneNumber: undefined
      };
      
      // Generate a fake token
      const mockToken = `dev-token-${Date.now()}-${username}`;
      localStorage.setItem('mentalhealthiq_token', mockToken);
      localStorage.setItem('mentalhealthiq_user', JSON.stringify(basicUser));
      
      console.log('Development login successful with user:', basicUser);
      
      return basicUser;
      
      /* Uncomment this section when ready to use real API authentication
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
            displayName: username,
            phoneNumber: undefined
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
