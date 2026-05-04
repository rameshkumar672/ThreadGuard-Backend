import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Matches API baseURL endpoint structure

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('⚡ Connected to ThreatGuard Socket:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from ThreatGuard Socket');
});
