import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setUser(authService.getUser());
    setIsInitialized(true);
  }, []);

  async function login(credentials) {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function register(data) {
    setLoading(true);
    try {
      const res = await authService.register(data);
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, isInitialized, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
