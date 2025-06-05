import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@erp:token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@erp:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});