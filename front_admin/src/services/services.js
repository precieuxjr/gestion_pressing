import { apiFetch } from '../services/api';

export const servicesService = {
  // Récupérer tous les services
  getAll: () => apiFetch('/admin/services'),

  // Récupérer un service par son ID public
  getById: (publicId) => apiFetch(`/admin/services/${publicId}`),

  // Récupérer les statistiques des services
  getStats: () => apiFetch('/admin/services/stats'),

  // Créer un nouveau service
  create: (data) => apiFetch('/admin/services', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Mettre à jour un service
  update: (publicId, data) => apiFetch(`/admin/services/${publicId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Supprimer un service
  delete: (publicId) => apiFetch(`/admin/services/${publicId}`, {
    method: 'DELETE',
  }),

  // Initialiser les services par défaut (seed, optionnel)
  seed: () => apiFetch('/admin/services/seed', {
    method: 'POST',
  }),
};