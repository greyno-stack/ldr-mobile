import { io } from 'socket.io-client';
import { Platform } from 'react-native';

const host = Platform.select({
  android: '10.0.2.2',
  ios: 'localhost',
  default: 'localhost',
});

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${host}:3000/api`;
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

let socket = null;

export const connectSocket = (token) => {
  if (!token) return null;

  if (socket) {
    socket.auth = { token };
    if (!socket.connected) socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
