import type { IChatConversation } from 'src/types/chat';
import { UserItem } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  currentUserId: string;
  conversation: IChatConversation;
  dataGroupFetched?: any;
};

export function useNavItem({ currentUserId, conversation, dataGroupFetched }: Props) {
  const { messages, participants } = conversation || {};

  const lastMessage =
    Array.isArray(messages) && messages.length > 0
      ? messages[messages.length - 1]
      : undefined;

  const participantsInConversation = Array.isArray(participants)
    ? participants.filter((p) => p.user.id !== currentUserId)
    : [];

  const displayName = conversation.name
    ? conversation.name
    : participantsInConversation
      .map((p) => `${p.user.lastName} ${p.user.firstName}`)
      .join(', ');

  const group = conversation.type === 'GROUP';
  const hasOnlineInGroup =
    group && participantsInConversation.some((p) => p.user.status === 'ACTIVE');

  let displayText = '';

  if (lastMessage) {
    const sender = dataGroupFetched?.find((u: any) => u.user?.id === lastMessage?.senderId);
    const senderLastName = sender?.user.lastName;
    const isOwn = lastMessage.senderId === currentUserId;
    const senderPrefix = isOwn ? 'Bạn: ' : senderLastName ? `${senderLastName}: ` : '';
    const messageText =
      lastMessage.contentType === 'image' ? 'Đã gửi một ảnh' : lastMessage.body || 'Chưa có tin nhắn';

    displayText = `${senderPrefix}${messageText}`;
  }

  return {
    group,
    displayName,
    displayText,
    participants: participantsInConversation,
    lastActivity: lastMessage?.createdAt || '',
    hasOnlineInGroup,
  };
}
