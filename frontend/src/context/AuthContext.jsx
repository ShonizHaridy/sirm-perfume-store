import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../api/config';
import { authService } from '../services';


export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await api.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setCurrentUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

const login = async (email, password) => {
  try {
    setError(null);
    console.log('Attempting login for:', email);
    
    const response = await api.post('/api/auth/login', { email, password });
    // const response = await authService.login(email, password);
    console.log('Login response:', response.data);
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      return response.data.user; // Return the user data including role
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = err.response?.data?.message || 'Login failed';
    setError(errorMessage);
    throw err;
  }
};

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

const logout = () => {
  localStorage.removeItem('token');
  setCurrentUser(null);
  
  // Optionally make a server request to invalidate the token
  api.post('/api/auth/logout')
    .catch(err => console.error('Error during logout:', err));
};

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await api.put('/api/auth/profile', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCurrentUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};