import api from './api.js';
import { connectSocket, disconnectSocket } from './socket.js';
import { setToken, clearToken } from './api.js'; // ou utilisez directement localStorage

const API_BASE_URL = '/livreur';

// ========================================
// 1. Connexion du livreur
// ========================================
export const loginLivreur = async (email, password) => {
  try {
    const response = await api.post(`${API_BASE_URL}/login`, { email, password });
    const { token, user } = response.data;

    if (!token) {
      throw new Error('Token non reçu');
    }

    // ✅ Stockage avec la bonne clé
    setToken(token);                 // via api.js
    // ou directement :
    // localStorage.setItem('token_livreur', token);

    localStorage.setItem('user', JSON.stringify(user));

    // Connexion Socket automatique
    connectSocket();

    return { success: true, user };
  } catch (error) {
    console.error('Erreur login livreur:', error);
    const message = error.response?.data?.message || error.message || 'Erreur de connexion';
    return { success: false, message };
  }
};

// ========================================
// 2. Récupérer les informations du livreur
// ========================================
export const getProfilLivreur = async () => {
  const response = await api.get(`${API_BASE_URL}/profil`);
  return response.data;
};

// ========================================
// 3. Déconnexion
// ========================================
export const logoutLivreur = () => {
  clearToken();          // ou localStorage.removeItem('token_livreur');
  localStorage.removeItem('user');
  disconnectSocket();
};