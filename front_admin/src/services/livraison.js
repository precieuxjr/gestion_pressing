import { apiFetch } from './api';

export const livraisonService = {
    getLivreursDisponibles: () => apiFetch('/admin/livraisons/livreurs/disponibles'),
    getAllLivreurs: () => apiFetch('/admin/livraisons/livreurs'),

    assignerLivreur: (commandeId, livreurId) =>
      apiFetch(`/admin/livraisons/commandes/${commandeId}/assigner`, {
          method: 'PATCH',
          body: JSON.stringify({ livreur_id: livreurId }),
      }),


    updateStatutLivraison: (commandeId, statut) =>
        apiFetch(`/admin/livraisons/commandes/${commandeId}/statut`, {
            method: 'PATCH',
            body: JSON.stringify({ statut_livraison: statut }),
        }),
        getCommandesLivraison: (statut = null) => {
          const url = statut ? `/admin/livraisons/commandes?statut=${statut}` : '/admin/livraisons/commandes';
          return apiFetch(url);
      },
  
      annulerAssignation: (commandeId) =>
        apiFetch(`/admin/livraisons/commandes/${commandeId}/assignation`, {
          method: 'DELETE',
        }),
};