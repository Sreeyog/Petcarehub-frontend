import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('petcarehub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('petcarehub_token') || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('petcarehub_theme') || 'light');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('petcarehub_theme', theme);
  }, [theme]);

  // Sync / refresh user on mount if token is present
  useEffect(() => {
    if (token) {
      api.auth.getMe()
        .then(userData => {
          setUser(userData);
          localStorage.setItem('petcarehub_user', JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('petcarehub_token', response.token);
      localStorage.setItem('petcarehub_user', JSON.stringify(response.user));
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await api.auth.register(userData);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('petcarehub_token', response.token);
      localStorage.setItem('petcarehub_user', JSON.stringify(response.user));
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('petcarehub_token');
    localStorage.removeItem('petcarehub_user');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      theme,
      isLoading,
      isLoggedIn: !!user,
      role: user?.role || null,
      login,
      register,
      logout,
      toggleTheme,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
