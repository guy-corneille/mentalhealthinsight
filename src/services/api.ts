
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Define interface for API error responses
interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  non_field_errors?: string[];
  [key: string]: any; // Allow for other properties
}

// Create a base API instance with common configuration
// This is where API requests are configured
const api = axios.create({
  // Base URL for all API requests - adjust this to match your backend
  baseURL: 'http://localhost:8000/api',
  
  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Set timeout to prevent hanging requests
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for API calls
// This would normally add auth tokens, but we've disabled that requirement
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    // No longer adding auth tokens - all requests go through without authentication
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling API responses and errors
// This processes the responses from the API
api.interceptors.response.use(
  (response) => {
    console.log(`Successful response from: ${response.config.url}`);
    return response.data;  // Return data directly
  },
  (error: AxiosError) => {
    // Log detailed error information for debugging
    console.error('API Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Request URL:', error.config?.url);
    console.error('Request Data:', error.config?.data);
    
    // No longer handling auth errors specifically - just log and pass through
    
    // Type assertion for the error response data
    const responseData = error.response?.data as ApiErrorResponse | undefined;
    
    // Create a more user-friendly error message
    let errorMessage = 
      responseData?.message || 
      responseData?.detail ||
      responseData?.error ||
      (responseData?.non_field_errors && responseData.non_field_errors[0]) ||
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
