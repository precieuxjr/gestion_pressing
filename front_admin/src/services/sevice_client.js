// services/clients.js
import { apiFetch } from './api';

export const clientsService = {
  getAll: () => apiFetch('/admin/clients'),
  getById: (publicId) => apiFetch(`/admin/clients/${publicId}`),
  create: (data) => apiFetch('/admin/clients', { method: 'POST', body: JSON.stringify(data) }),
  update: (publicId, data) => apiFetch(`/admin/clients/${publicId}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (publicId) => apiFetch(`/admin/clients/${publicId}`, { method: 'DELETE' }),
  
};