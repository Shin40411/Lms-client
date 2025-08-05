export const SOCKET_OUTGOING_EVENTS = {
  SEND_MESSAGE: 'sendMessage',
  EDIT_MESSAGE: 'editMessage',
  DELETE_MESSAGE: 'deleteMessage',
  SEEN_MESSAGE: 'seenMessage',

  START_TYPING: 'startTyping',
  STOP_TYPING: 'stopTyping',

  JOIN_CONVERSATION: 'joinConversation',
  CREATE_CONVERSATION: 'createConversation',
  UPDATE_CONVERSATION: 'updateConversation',
  DELETE_CONVERSATION: 'deleteConversation',

  ADD_USER_TO_CONVERSATION: 'addUserToConversation',
  REMOVE_USER_FROM_CONVERSATION: 'removeUserFromConversation',

  UPDATE_LAST_SEEN: 'updateLastSeen',
} as const;

export const SOCKET_INCOMING_EVENTS = {
  MESSAGE_RECEIVED: 'messageReceived',
  MESSAGE_EDITED: 'messageEdited',
  MESSAGE_DELETED: 'messageDeleted',
  MESSAGE_SEEN: 'messageSeen',

  USER_TYPING: 'userTyping',
  USER_STOPPED_TYPING: 'userStoppedTyping',

  CONVERSATION_CREATED: 'conversationCreated',
  CONVERSATION_UPDATED: 'conversationUpdated',
  CONVERSATION_DELETED: 'conversationDeleted',

  USER_ADDED_TO_CONVERSATION: 'userAddedToConversation',
  USER_REMOVED_FROM_CONVERSATION: 'userRemovedFromConversation',
  USER_JOINED_CONVERSATION: 'userJoinedConversation',

  LAST_SEEN_UPDATED: 'lastSeenUpdated',

  NOTIFICATION_NEW_MESSAGE: 'notificationNewMessage',
  MENTION_IN_MESSAGE: 'mentionInMessage',

  NOTIFICATION_NEW: 'notificationNew',
} as const;

export const SOCKET_NAMESPACES = {
  CHAT: 'chat',
  CONVERSATION: 'conversation',
  NOTIFICATION: 'notification',
  PRESENCE: 'presence',
} as const;
