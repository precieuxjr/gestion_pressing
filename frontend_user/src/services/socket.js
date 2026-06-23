// src/services/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  // On peut ajouter le token JWT pour authentification
  auth: {
    token: localStorage.getItem('token')
  }
});

socket.on('connect', () => {
  console.log('🔌 Socket client connecté');
});

socket.on('disconnect', () => {
  console.log('🔌 Socket client déconnecté');
});

export default socket;