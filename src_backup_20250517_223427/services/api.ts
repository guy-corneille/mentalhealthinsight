
/**
 * Core API Service
 * 
 * This service provides the base API client configuration and error handling.
 * It's used by all other services to make API requests.
 */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
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
  // Base URL for all API requests
  baseURL: 'http://localhost:8000',
  
  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Set timeout to prevent hanging requests
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`, config.method, config.params || {});
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling API responses and errors
api.interceptors.response.use(
  (response) => {
    console.log(`Successful response from: ${response.config.url}`, response.status);
    return response.data;  // Return data directly
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
    api.get<T, T>(url, { params }),
  
  // POST request method - used for creating new resources
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T, T>(url, data, config),
  
  // PUT request method - used for updating existing resources
  put: <T>(url: string, data?: any) => 
    api.put<T, T>(url, data),
  
  // PATCH request method - used for partial updates
  patch: <T>(url: string, data?: any) => 
    api.patch<T, T>(url, data),
  
  // DELETE request method - used for removing resources
  delete: <T>(url: string) => 
    api.delete<T, T>(url),
};
