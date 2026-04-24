import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem("cs_token");
      if (token) {
        try {
          const res = await api.me();
          setUser({ email: res.email, name: res.name, role: res.role });
          setRole(res.role);
          setIsAuthenticated(true);
        } catch (e) {
          sessionStorage.removeItem("cs_token");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password, selectedRole) => {
    try {
      const res = await api.login(email, password, selectedRole);
      sessionStorage.setItem("cs_token", res.access_token);
      setUser({ email, name: res.name, role: res.role });
      setRole(res.role);
      setIsAuthenticated(true);
      return { success: true };
    } catch(e) {
      return { success: false, error: "Invalid credentials" };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('cs_token');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  // RBAC helpers
  const canWrite = () => role === 'Admin' || role === 'Analyst';
  const canAdmin = () => role === 'Admin';
  const canTrain = () => role === 'Admin';

  const value = {
    user,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    canWrite,
    canAdmin,
    canTrain
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
