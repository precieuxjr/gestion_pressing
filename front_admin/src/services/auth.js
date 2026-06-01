import { apiFetch } from './api';

export const authService = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => {
    localStorage.removeItem('token');
    // redirection éventuelle
  },
  getCurrentUser: () => apiFetch('/auth/me'),
};