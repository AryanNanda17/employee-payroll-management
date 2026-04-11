import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMe = useCallback(async () => {
    try {
      const response = await api.get('/me');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    await api.delete('/logout');
    setUser(null);
  };

  useEffect(() => {
    getMe();
  }, [getMe]);

  const value = {
    user,
    loading,
    login,
    logout,
    getMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
