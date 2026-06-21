// src/services/authService.js

// Base URL de l'API (à adapter selon votre environnement)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// =========================================
// 1️⃣ Connexion
// =========================================
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Erreur de connexion');
  }
  return data; // { token, user }
};

// =========================================
// 2️⃣ Inscription (avec postnom optionnel)
// =========================================
export const register = async (userData) => {
  // userData doit contenir :
  // { nom, prenom, postnom?, email, telephone, password, adresse, role? }
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom: userData.nom,
      prenom: userData.prenom,
      postnom: userData.postnom || '',  // ← postnom optionnel
      email: userData.email,
      telephone: userData.telephone,
      password: userData.password,
      adresse: userData.adresse,
      role: userData.role || 'client'
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de l\'inscription');
  }
  return data;
};

// =========================================
// 3️⃣ Déconnexion
// =========================================
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// =========================================
// 4️⃣ Récupérer l'utilisateur courant
// =========================================
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// =========================================
// 5️⃣ Récupérer le token
// =========================================
export const getToken = () => {
  return localStorage.getItem('token');
};

// =========================================
// 6️⃣ Vérifier si l'utilisateur est authentifié
// =========================================
export const isAuthenticated = () => {
  return !!getToken();
};