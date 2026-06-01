import { apiFetch } from './api';

export const clientsService = {
  getAll: () => apiFetch('/admin/clients'),
  getById: (id) => apiFetch(`/admin/clients/${id}`),
  create: (data) => apiFetch('/admin/clients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/admin/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/admin/clients/${id}`, { method: 'DELETE' }),
};