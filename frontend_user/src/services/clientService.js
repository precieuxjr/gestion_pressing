// src/services/clientService.js
import {apiPost, apiGet, apiPut } from './api';

export const clientService = {
  // Récupérer les statistiques du client
  getStats: () => apiGet('/client/stats'),

  // Récupérer les commandes du client (avec pagination optionnelle)
  getCommandes: (limit = 10, offset = 0) =>
    apiGet(`/client/commandes?limit=${limit}&offset=${offset}`),

  // Récupérer les détails d'une commande
  getCommandeDetails: (id) => apiGet(`/client/commandes/${id}`),
  

  // Annuler une commande (PUT)
  annulerCommande: (id) => apiPut(`/client/commandes/${id}/annuler`),
    // ✅ Ajout de la méthode manquante
    creerCommande: (data) => apiPost('/client/commandes', data),
  
};