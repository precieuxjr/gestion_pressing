// src/services/livraison.js
import { apiFetch } from './api';

/**
 * Service pour la gestion des livraisons (admin)
 */
export const livraisonService = {
  /**
   * Récupère la liste des livreurs disponibles
   */
  getLivreursDisponibles: () => {
    console.log('🔍 Appel GET :', '/admin/livraisons/livreurs/disponibles');
    return apiFetch('/admin/livraisons/livreurs/disponibles');
  },

  /**
   * Récupère la liste de tous les livreurs (admin)
   */
  getAllLivreurs: () => apiFetch('/admin/livraisons/livreurs'),

  /**
   * Assigner un livreur à une commande
   * @param {string} commandePublicId - public_id de la commande
   * @param {string} livreurPublicId - public_id du livreur
   */
  assignerLivreur: (commandePublicId, livreurPublicId) =>
    apiFetch(`/admin/livraisons/commandes/${commandePublicId}/assigner`, {  // ← 'assigner' sans tiret
        method: 'PATCH',   // ← utiliser PATCH (comme défini dans le backend)
        body: JSON.stringify({ livreur_id: livreurPublicId }),
    }),

  /**
   * Mettre à jour le statut de livraison d'une commande
   * @param {string} commandePublicId - public_id de la commande
   * @param {string} statut - nouveau statut (ex: 'En cours', 'Livrée')
   */
  updateStatutLivraison: (commandePublicId, statut) =>
    apiFetch(`/admin/livraisons/commandes/${commandePublicId}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut_livraison: statut }),
    }),

  /**
   * Récupérer les commandes de livraison (avec filtre optionnel par statut)
   * @param {string|null} statut - statut de livraison (ex: 'En attente', 'Livrée')
   */
  getCommandesLivraison: (statut = 'Pret') => {
    const url = statut 
      ? `/admin/livraisons/commandes?statut=${statut}` 
      : '/admin/livraisons/commandes';
    return apiFetch(url);
  },
  

  /**
   * Annuler l'assignation d'un livreur à une commande
   * @param {string} commandePublicId - public_id de la commande
   */
  annulerAssignation: (commandePublicId) =>
    apiFetch(`/admin/livraisons/commandes/${commandePublicId}/assignation`, {
        method: 'DELETE',
    }),
};