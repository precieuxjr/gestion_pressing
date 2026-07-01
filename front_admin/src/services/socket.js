import { io } from 'socket.io-client';

const TOKEN_KEYS = {
  admin: 'token_admin',
  livreur: 'token_livreur',
  client: 'token_client',
};

const getCurrentRole = () => {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/livreur')) return 'livreur';
  return 'client';
};

const getToken = () => {
  const key = TOKEN_KEYS[getCurrentRole()];
  return localStorage.getItem(key);
};

// ✅ Création de la socket avec autoConnect = false
export const socket = io('http://localhost:5000', {
  auth: (cb) => {
    const token = getToken();
    console.log(`🔑 Token pour socket (${getCurrentRole()}) :`, token ? 'présent' : 'absent');
    cb({ token });
  },
  autoConnect: false,   // ← Important : ne pas se connecter automatiquement
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

// ✅ Fonction pour reconnecter (à appeler après login)
export const reconnectSocket = () => {
  console.log('🔄 Reconnexion socket demandée...');
  if (socket.disconnected) {
    socket.connect();
  } else {
    socket.disconnect();
    socket.connect();
  }
};