import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { AuthState, LoginCredentials, RegisterCredentials } from '@/types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  // @authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const { data } = await axios.get('/api/auth/profile');
        setState({
          user: data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { data } = await axios.post('/api/auth/login', credentials);
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/dashboard');
      toast.success('Login successful!');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [navigate]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { data } = await axios.post('/api/auth/register', credentials);
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/dashboard');
      toast.success('Registration successful!');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
    toast.success('Logged out successfully');
  }, [navigate]);

  // @axios configuration
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      axios.defaults.baseURL = API_URL;
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};