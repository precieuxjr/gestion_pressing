import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  auth: {
    token: localStorage.getItem('token')
  }
});

socket.on('connect', () => console.log('🔌 Socket livreur connecté'));
socket.on('disconnect', () => console.log('🔌 Socket livreur déconnecté'));

export default socket;