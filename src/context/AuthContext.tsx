'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials } from '@/types/auth';
import Loading from '@/components/loading';
import { login as apiLogin } from '@/services/api';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth state from localStorage on mount
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      setAuthState(JSON.parse(savedAuth));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const data = await apiLogin(credentials.email, credentials.password);
      
      const newAuthState = {
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      };

      setAuthState(newAuthState);
      localStorage.setItem('auth', JSON.stringify(newAuthState));
      
      // Also store token in localStorage for API calls
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthState(initialState);
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 