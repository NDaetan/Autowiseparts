import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login as authLogin, logout as authLogout, getCurrentUsername } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCurrentUser());

  useEffect(() => {
    // No need to check here, as useState already does it
  }, []);

  const login = async (username, password) => {
    try {
      await authLogin(username, password);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    authLogout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getCurrentUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};