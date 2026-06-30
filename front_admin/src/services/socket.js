// src/services/socket.js
import { io } from 'socket.io-client';

// 🔑 Clés de stockage par rôle (identiques à celles de api.js)
const TOKEN_KEYS = {
  admin: 'token_admin',
  livreur: 'token_livreur',
  client: 'token_client',
};

// 🧠 Déterminer le rôle actuel en fonction de l'URL
const getCurrentRole = () => {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/livreur')) return 'livreur';
  return 'client';
};

// 🔑 Récupérer la bonne clé de token
const tokenKey = TOKEN_KEYS[getCurrentRole()];
const token = localStorage.getItem(tokenKey);

console.log(`🔑 Token pour socket (${getCurrentRole()}) :`, token ? 'présent' : 'absent');

export const socket = io('http://localhost:5000', {
  auth: { token },
  transports: ['polling', 'websocket'],
});

socket.on('connect', () => {
  console.log(`✅ Socket connecté (${getCurrentRole()})`);
});

socket.on('connect_error', (err) => {
  console.error('❌ Erreur de connexion socket :', err.message);
});

socket.on('disconnect', () => {
  console.log(`🔴 Socket déconnecté (${getCurrentRole()})`);
});