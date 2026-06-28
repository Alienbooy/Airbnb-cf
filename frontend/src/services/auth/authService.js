import gateway from '../api/gateway';

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

export const authService = {
  async register(data) {
    await gateway.post('/auth/register', {
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
      roles: [data.role === 'host' ? 'host' : 'client'],
    });
    
    return { success: true };
  },

  async login(credentials) {
    const loginResponse = await gateway.post('/auth/login', {
      email: credentials.email.trim(),
      password: credentials.password,
    });

    const { access, refresh } = loginResponse.data;
    sessionStorage.setItem('token', access);
    sessionStorage.setItem('refreshToken', refresh);

    const profileResponse = await gateway.get('/auth/profile');
    const user = normalizeBackendUser(profileResponse.data);
    sessionStorage.setItem('user', JSON.stringify(user));

    return { token: access, refreshToken: refresh, user };
  },

  async logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  },

  async getProfile() {
    const profileResponse = await gateway.get('/auth/profile');
    const user = normalizeBackendUser(profileResponse.data);
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  getUser() {
    if (typeof window === 'undefined') return null;
    const u = sessionStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },

  getToken() {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('token');
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem('token');
  },
};
