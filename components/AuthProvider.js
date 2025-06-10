'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(false); // Changed to false for immediate load

  // Mock authentication - disable Firebase for now
  useEffect(() => {
    // Simulate quick auth check without Firebase
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const value = {
    user,
    adminData,
    loading,
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

