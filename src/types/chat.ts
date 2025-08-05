import type { BadgeProps } from '@mui/material/Badge';

import type { IDateValue } from './common';
import { UserItem } from './user';

// ----------------------------------------------------------------------

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IChatMessage = {
  id: string;
  body: string;
  senderId: string;
  contentType: string;
  createdAt: IDateValue;
  attachments: IChatAttachment[];
};

export type IChatParticipant = {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: IDateValue;
  status: BadgeProps['variant'];
};

export type IChatConversation = {
  id: string;
  type: string;
  messages: IChatMessage[];
  name?: string;
  unreadCount?: number;
  participants?: { user: UserItem }[];
};

export type IChatConversations = {
  allIds: string[];
  byId: Record<string, IChatConversation>;
};

export type IChatBodySender = {
  conversationId: string;
  contentType: string;
  body: string;
}