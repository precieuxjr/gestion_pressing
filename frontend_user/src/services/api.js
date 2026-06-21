// src/services/api.js

// Base URL de l'API (à adapter selon votre environnement)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fonction générique pour les appels API
 * @param {string} endpoint - Chemin de l'API (ex: '/client/commandes')
 * @param {object} options - Options de fetch (method, body, headers, etc.)
 * @returns {Promise} - Promesse résolue avec les données JSON
 */
export const apiFetch = async (endpoint, options = {}) => {
  // Récupérer le token depuis localStorage
  const token = localStorage.getItem('token');

  // Headers par défaut
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Construire l'URL complète
  const url = `${API_BASE_URL}${endpoint}`;

  // Effectuer la requête
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Tenter de parser la réponse JSON
  let data;
  try {
    data = await response.json();
  } catch (error) {
    // Si la réponse n'est pas du JSON (ex: HTML d'erreur)
    throw new Error('Erreur de communication avec le serveur');
  }

  // Gérer les erreurs HTTP
  if (!response.ok) {
    const message = data.message || data.error || 'Une erreur est survenue';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// =========================================
// Options préconfigurées pour les méthodes HTTP
// =========================================

/**
 * Requête GET
 */
export const apiGet = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'GET' });

/**
 * Requête POST
 */
export const apiPost = (endpoint, body, options = {}) =>
  apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });

/**
 * Requête PUT
 */
export const apiPut = (endpoint, body, options = {}) =>
  apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });

/**
 * Requête PATCH
 */
export const apiPatch = (endpoint, body, options = {}) =>
  apiFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });

/**
 * Requête DELETE
 */
export const apiDelete = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'DELETE' });

export default {
  apiFetch,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
};