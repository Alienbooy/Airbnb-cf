import gateway from '../api/gateway';

const AUTH_PREFIX = '/auth';

export const authService = {
  async register(data) {
    const res = await gateway.post(`${AUTH_PREFIX}/register`, data);
    return res.data;
  },

  async login(credentials) {
    const res = await gateway.post(`${AUTH_PREFIX}/login`, credentials);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return res.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getProfile() {
    const res = await gateway.get(`${AUTH_PREFIX}/profile`);
    return res.data;
  },

  getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};
