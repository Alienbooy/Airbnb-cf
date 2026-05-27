import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);

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
      setUser(res.user);
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
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
