import { apiFetch } from './api';

export const paiementsService = {
  getAll: () => apiFetch('/admin/paiements'),
  getStats: () => apiFetch('/admin/paiements/stats'),
  getByCommande: (commandeId) => apiFetch(`/admin/paiements/commande/${commandeId}`),
  getById: (publicId) => apiFetch(`/admin/paiements/${publicId}`),
  create: (data) => apiFetch('/admin/paiements', { method: 'POST', body: JSON.stringify(data) }),
  updateStatut: (publicId, statut) => apiFetch(`/admin/paiements/${publicId}/statut`, { method: 'PATCH', body: JSON.stringify({ statut }) }),
  updateNote: (publicId, note) => apiFetch(`/admin/paiements/${publicId}/note`, { method: 'PATCH', body: JSON.stringify({ note }) }),
  delete: (publicId) => apiFetch(`/admin/paiements/${publicId}`, { method: 'DELETE' }),
};