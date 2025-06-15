import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
    // Get token from localStorage or your auth state management
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            // You might want to redirect to login or refresh token
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 