import gateway from '../api/gateway';
import mockData from '../../mocks/api-mocks.json';

function toAppRole(roles = []) {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('host')) return 'host';
  return 'guest';
}

function normalizeBackendUser(user) {
  return {
    id: String(user.id),
    username: user.username,
    firstName: user.username,
    lastName: '',
    name: user.username,
    email: user.email,
    role: toAppRole(user.roles),
    roles: user.roles || ['client'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    phone: '',
    status: 'active',
    createdAt: user.created_at,
  };
}

function delay(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 250);
  });
}

export const authService = {
  async register(data) {
    await gateway.post('/auth/register', {
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
    });
    
    return { success: true };
  },

  async login(credentials) {
    const loginResponse = await gateway.post('/auth/login', {
      email: credentials.email.trim(),
      password: credentials.password,
    });

    const { access, refresh } = loginResponse.data;
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);

    const profileResponse = await gateway.get('/auth/profile');
    const user = normalizeBackendUser(profileResponse.data);
    localStorage.setItem('user', JSON.stringify(user));

    return { token: access, refreshToken: refresh, user };
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  async getProfile() {
    return delay(this.getUser() || mockData.auth.profileResponse);
  },

  getUser() {
    if (typeof window === 'undefined') return null;
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },
};
