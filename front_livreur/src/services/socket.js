import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// 🔑 Clés de token par rôle
const TOKEN_KEYS = {
  admin: 'token_admin',
  livreur: 'token_livreur',
  client: 'token_client',
};

// 🧠 Déterminer le rôle à partir de l'URL
const getCurrentRole = () => {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/livreur')) return 'livreur';
  return 'client';
};

// 🔑 Récupérer le token correspondant
const getToken = () => {
  const key = TOKEN_KEYS[getCurrentRole()];
  return localStorage.getItem(key);
};

// 1️⃣ Création de la socket (autoConnect = false)
export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: false,
});

// ✅ Exposer globalement pour le debug
if (typeof window !== 'undefined') {
  window.socket = socket;
}

// 2️⃣ Fonction de connexion
export const connectSocket = () => {
  const token = getToken();
  if (!token) {
    console.warn(`⚠️ Aucun token trouvé pour ${getCurrentRole()}, connexion socket annulée.`);
    return false;
  }

  socket.auth = { token };
  socket.connect();
  console.log(`🔌 Tentative de connexion Socket (${getCurrentRole()}) avec token...`);
  return true;
};

// 3️⃣ Déconnexion
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('🔌 Socket déconnectée manuellement');
  }
};

// 4️⃣ Listeners
socket.on('connect', () => {
  console.log(`✅ Socket ${getCurrentRole()} connecté`);
});
socket.on('disconnect', () => {
  console.log(`🔴 Socket ${getCurrentRole()} déconnecté`);
});
socket.on('connect_error', (err) => {
  console.error(`❌ Erreur socket (${getCurrentRole()}) :`, err.message);
});

export default socket;