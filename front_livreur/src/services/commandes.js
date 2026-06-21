// src/services/commandeService.js

const API_BASE_URL = 'http://localhost:5000/api/livreur';

// Récupérer le token depuis localStorage (pratique pour les appels)
const getToken = () => localStorage.getItem('token');

// Headers par défaut avec le token
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Gestionnaire d'erreurs générique
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }
  return data;
};

// ========================================
// 1. Récupérer les commandes du livreur
// ========================================
export const getMesCommandes = async () => {
  const response = await fetch(`${API_BASE_URL}/commandes`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

// ========================================
// 2. Récupérer les commandes disponibles
// ========================================
export const getCommandesDisponibles = async () => {
  const response = await fetch(`${API_BASE_URL}/commandes/disponibles`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

// ========================================
// 3. Accepter une commande (s'assigner)
// ========================================
export const accepterCommande = async (commandeId) => {
  const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}/accepter`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse(response);
};

// ========================================
// 4. Mettre à jour le statut de livraison
// ========================================
export const updateStatutLivraison = async (commandeId, statutLivraison) => {
  const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}/statut-livraison`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ statut_livraison: statutLivraison })
  });
  return handleResponse(response);
};

// ========================================
// 5. Marquer une commande comme payée
// ========================================
export const payerCommande = async (commandeId) => {
  const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}/payer`, {
    method: 'PUT',
    headers: getHeaders()
  });
  return handleResponse(response);
};

// ========================================
// 6. Récupérer les détails d'une commande
// ========================================
export const getCommandeDetails = async (commandeId) => {
  const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

// ========================================
// 7. Récupérer les statistiques du livreur
// ========================================
export const getMesStatistiques = async () => {
  const response = await fetch(`${API_BASE_URL}/statistiques`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};