"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          try {
            const res = await API.get('auth/profile/');
            setUser(res.data);
          } catch (err) {
            console.error("Token invalid or expired.", err);
            logout();
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('auth/login/', { email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
      }
      
      // Fetch user details immediately after login
      const profileRes = await API.get('auth/profile/');
      setUser(profileRes.data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(profileRes.data));
      }
      return { success: true, user: profileRes.data };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.detail || "Invalid email or password."
      };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  const hasRole = (roles) => {
    return user && roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
