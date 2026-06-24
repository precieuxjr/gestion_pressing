// src/services/api.js
import axios from 'axios';

// Clé unique pour le token du livreur
const TOKEN_KEY = 'token_livreur';

// Récupérer le token
const getToken = () => localStorage.getItem(TOKEN_KEY);

// Définir le token (pour la connexion)
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Supprimer le token (déconnexion)
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Instance Axios dédiée au livreur
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur : ajoute le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;