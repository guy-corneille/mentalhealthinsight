
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
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
    
    return Promise.reject(error);
  }
);

// Define an interface for error data
interface ErrorResponse {
  message?: string;
  detail?: string;
  [key: string]: any;
}

// Generic request method
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    
    // Create a more user-friendly error
    const errorMessage = 
      axiosError.response?.data?.message || 
      axiosError.response?.data?.detail ||
      (axiosError.message as string) || 
      'An unknown error occurred';
    
    const apiError = new Error(errorMessage);
    
    // Add status code to error object for easier handling
    Object.assign(apiError, { 
      status: axiosError.response?.status, 
      data: axiosError.response?.data 
    });
    
    throw apiError;
  }
};

export default {
  get: <T>(url: string, params?: any) => 
    request<T>({ method: 'GET', url, params }),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    request<T>({ method: 'POST', url, data, ...config }),
  
  put: <T>(url: string, data?: any) => 
    request<T>({ method: 'PUT', url, data }),
  
  patch: <T>(url: string, data?: any) => 
    request<T>({ method: 'PATCH', url, data }),
  
  delete: <T>(url: string) => 
    request<T>({ method: 'DELETE', url }),
};
