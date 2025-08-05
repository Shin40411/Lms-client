import { io, Socket } from 'socket.io-client';
import { SOCKET_NAMESPACES } from 'src/constants/socket-events';
import { CONFIG } from 'src/global-config';

const baseURL = CONFIG.serverUrl || 'http://localhost:8080';

export const socketChat = io(`${baseURL}/${SOCKET_NAMESPACES.CHAT}`, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});

export const socketConversation = io(`${baseURL}/${SOCKET_NAMESPACES.CONVERSATION}`, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});

export const socketNotification = io(`${baseURL}/${SOCKET_NAMESPACES.NOTIFICATION}`, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});

export const socketPresence = io(`${baseURL}/${SOCKET_NAMESPACES.PRESENCE}`, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});
