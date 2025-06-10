'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAdminAuthStateChanged } from '../lib/auth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = onAdminAuthStateChanged((authData) => {
        if (authData) {
          setUser(authData.user);
          setAdminData(authData.adminData);
        } else {
          setUser(null);
          setAdminData(null);
        }
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    adminData,
    loading,
    error,
    isAuthenticated: !!user && !!adminData,
    isAdmin: !!adminData,
    hasPermission: (permission) => {
      if (!adminData) return false;
      if (adminData.permissions?.includes('all')) return true;
      return adminData.permissions?.includes(permission) || false;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

