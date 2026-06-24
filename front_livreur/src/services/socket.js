import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// 1️⃣ Création de la socket (autoConnect = false)
export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: false,          // On ne connecte pas automatiquement
});

// 2️⃣ Fonction pour connecter la socket avec le token
export const connectSocket = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ Aucun token trouvé, connexion socket annulée.');
    return false;
  }

  // Mise à jour du token dans l'objet auth
  socket.auth = { token };
  
  // Connexion effective
  socket.connect();
  console.log('🔌 Tentative de connexion Socket avec token...');
  return true;
};

// 3️⃣ Fonction pour déconnecter la socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('🔌 Socket déconnectée manuellement');
  }
};

// 4️⃣ Listeners (pour le debug)
socket.on('connect', () => console.log('🔌 Socket livreur connecté'));
socket.on('disconnect', () => console.log('🔌 Socket livreur déconnecté'));
socket.on('connect_error', (err) => console.error('❌ Erreur socket:', err.message));

// Export par défaut (optionnel)
export default socket;