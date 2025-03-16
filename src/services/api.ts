
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define interface for API error responses
interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: any; // Allow for other properties
}

// Create a base API instance with common configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mentalhealthiq_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;  // Using Token for Django's token auth
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response.data,  // Return data directly
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and user data
      localStorage.removeItem('mentalhealthiq_token');
      localStorage.removeItem('mentalhealthiq_user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Type assertion for the error response data
    const responseData = error.response?.data as ApiErrorResponse | undefined;
    
    // Create a more user-friendly error message
    const errorMessage = 
      responseData?.message || 
      responseData?.detail ||
      responseData?.error ||
      (error.message as string) || 
      'An unknown error occurred';
    
    const apiError = new Error(errorMessage);
    
    // Add status code to error object for easier handling
    Object.assign(apiError, { 
      status: error.response?.status, 
      data: error.response?.data 
    });
    
    throw apiError;
  }
);

export default {
  get: <T>(url: string, params?: any) => 
    api.get<T, T>(url, { params }),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T, T>(url, data, config),
  
  put: <T>(url: string, data?: any) => 
    api.put<T, T>(url, data),
  
  patch: <T>(url: string, data?: any) => 
    api.patch<T, T>(url, data),
  
  delete: <T>(url: string) => 
    api.delete<T, T>(url),
};
