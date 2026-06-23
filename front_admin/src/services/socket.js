import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
console.log('🔑 Token pour socket :', token ? 'présent' : 'absent');

export const socket = io('http://localhost:5000', {
  auth: { token },
  transports: ['polling', 'websocket'], // ← polling en premier
});

socket.on('connect', () => {
  console.log('✅ Socket connecté (admin)');
});

socket.on('connect_error', (err) => {
  console.error('❌ Erreur de connexion socket :', err.message);
});

socket.on('disconnect', () => {
  console.log('🔴 Socket déconnecté (admin)');
});