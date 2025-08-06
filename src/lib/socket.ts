import { io, Socket } from 'socket.io-client';
import { JWT_STORAGE_KEY } from 'src/auth/context/jwt';
import { SOCKET_NAMESPACES } from 'src/constants/socket-events';
import { CONFIG } from 'src/global-config';

const baseURL = CONFIG.serverUrl || 'http://localhost:8080';
const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

export const socketChat = io(`${baseURL}/${SOCKET_NAMESPACES.CHAT}`, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
  auth: { token: accessToken }
});

export const socketConversation = io(`${baseURL}/${SOCKET_NAMESPACES.CONVERSATION}`, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
  auth: { token: accessToken }
});

export const socketNotification = io(`${baseURL}/${SOCKET_NAMESPACES.NOTIFICATION}`, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
  auth: { token: accessToken }
});

export const socketPresence = io(`${baseURL}/${SOCKET_NAMESPACES.PRESENCE}`, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
  auth: { token: accessToken }
});
