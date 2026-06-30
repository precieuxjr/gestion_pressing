import { apiFetch } from './api';

export const authService = {
  login: (email, password) =>
    apiFetch('/admin/authentification', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};