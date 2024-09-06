import { io } from 'socket.io-client';

// Connecte-toi au serveur Socket.IO
const socket = io('http://localhost:8080', {
  transports: ['websocket'], // Assure que la connexion se fasse via WebSocket uniquement
});

export default socket;
