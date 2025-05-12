import axios from 'axios';

// Create custom axios instance with the correct base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend server URL
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to handle authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;