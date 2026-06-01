// services/commandes.js
import { apiFetch } from './api';

export const commandesService = {
  getAll: () => apiFetch('/admin/commandes'),
  getById: (id) => apiFetch(`/admin/commandes/${id}`),
  updateStatus: (id, status) =>
    apiFetch(`/admin/commandes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  // autres méthodes (create, delete...)
};