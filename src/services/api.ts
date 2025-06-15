/**
 * Core API Service
 * 
 * This service provides the base API configuration and error handling.
 * It's used by all other services to make API requests.
 */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Define interface for API error responses
interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  non_field_errors?: string[];
  [key: string]: any; // Allow for other properties
}

// Create a base API instance with common configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',  // Point directly to Django backend
  withCredentials: true,  // Important for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use((config) => {
  console.log('Making request:', config.method?.toUpperCase(), config.url);
    return config;
});

// Response interceptor for handling API responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;  // Return full response for more control
  },
  (error: AxiosError) => {
    // Log detailed error information for debugging
    console.error('API Error:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Request URL:', error.config?.url);
    console.error('Request Method:', error.config?.method);
    
    // Create a more user-friendly error message
    const responseData = error.response?.data as ApiErrorResponse | undefined;
    
    let errorMessage = 
      responseData?.message || 
      responseData?.detail ||
      responseData?.error ||
      (responseData?.non_field_errors && responseData.non_field_errors[0]) ||
      (error.message) || 
      'An unknown error occurred';
    
    // Show toast notification for API errors
    toast.error(`Error: ${errorMessage}`);
    
    return Promise.reject(error);
  }
);

// Export API methods for making different types of requests
export default {
  // GET request method - used for retrieving data
  get: <T>(url: string, params?: any) => 
    api.get<T>(url, { params }).then(response => response.data),
  
  // POST request method - used for creating new resources
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config).then(response => response.data),
  
  // PUT request method - used for updating existing resources
  put: <T>(url: string, data?: any) => 
    api.put<T>(url, data).then(response => response.data),
  
  // PATCH request method - used for partial updates
  patch: <T>(url: string, data?: any) => 
    api.patch<T>(url, data).then(response => response.data),
  
  // DELETE request method - used for removing resources
  delete: <T>(url: string) => 
    api.delete<T>(url).then(response => response.data),
};

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface ApiResponse<T> {
  data: T | PaginatedResponse<T>;
  detail?: string;
}
