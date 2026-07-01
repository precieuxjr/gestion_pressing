// src/services/livreurService.js
import api from './api.js';

const BASE_URL = '/livreur';

// Récupérer le profil du livreur connecté
export const getProfil = async () => {
  const response = await api.get(`${BASE_URL}/profil`);
  return response.data; // { nom, prenom, postnom, email, telephone, adresse, role, ... }
};

// Mettre à jour le profil
export const updateProfil = async (data) => {
  const response = await api.put(`${BASE_URL}/profil`, data);
  return response.data;
};

// Changer le mot de passe
export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.put(`${BASE_URL}/password`, { oldPassword, newPassword });
  return response.data;
};
