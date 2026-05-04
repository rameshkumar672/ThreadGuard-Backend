import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load, restore session from token stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('tg_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('tg_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await api.post('/threatguard/login', credentials);
      const { token, user: userData } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('tg_user', JSON.stringify(userData));
      setUser(userData);

      toast.success(`Welcome back, ${userData.name || 'Agent'}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check credentials.');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/threatguard/register', userData);
      toast.success('Account created! Please log in.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed!');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tg_user');
    setUser(null);
    toast.success('Session terminated. Stay secure.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
