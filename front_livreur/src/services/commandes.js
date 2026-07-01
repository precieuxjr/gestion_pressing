// src/services/commandes.js
import api from './api.js';

// Base des routes spécifiques au livreur (préfixe déjà inclus dans api.baseURL)
const API_BASE_URL = '/livreur';

// ========================================
// 1. Récupérer les commandes du livreur
// ========================================
export const getMesCommandes = async () => {
  const response = await api.get(`${API_BASE_URL}/commandes`);
  return response.data;
};

// ========================================
// 2. Récupérer les commandes disponibles
// ========================================
export const getCommandesDisponibles = async () => {
  const response = await api.get(`${API_BASE_URL}/commandes/disponibles`);
  return response.data;
};

// ========================================
// 3. Accepter une commande (s'assigner)
// ========================================
export const accepterCommande = async (commandeId) => {
  const response = await api.post(`${API_BASE_URL}/commandes/${commandeId}/accepter`);
  return response.data;
};

// ========================================
// 4. Mettre à jour le statut de livraison
// ========================================
export const updateStatutLivraison = async (commandeId, statut) => {
  const response = await api.put(`${API_BASE_URL}/commandes/${commandeId}/statut-livraison`, {
    statut_livraison: statut,
  });
  return response.data;
};

// ========================================
// 5. Marquer une commande comme payée
// ========================================
export const payerCommande = async (commandeId) => {
  const response = await api.put(`${API_BASE_URL}/commandes/${commandeId}/payer`);
  return response.data;
};

// ========================================
// 6. Récupérer les détails d'une commande
// ========================================

export const getCommandeDetails = (commandeId) => {
  return api.get(`/livreur/commandes/${commandeId}`).then(res => res.data);
};

// ========================================
// 7. Récupérer les statistiques du livreur
// ========================================
export const getMesStatistiques = async () => {
  const response = await api.get(`${API_BASE_URL}/statistiques`);
  return response.data;
};
