import type { IChatMessage } from 'src/types/chat';
import { UserItem } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  currentUserId: string;
  message: IChatMessage;
  participants: { user: UserItem }[];
};

export function getMessage({ message, participants, currentUserId }: Props) {
  const sender = participants.find((participant) => participant.user.id === message.senderId);

  const isCurrentUser = message.senderId === currentUserId;

  const displayName = `${sender?.user.lastName} ${sender?.user.firstName}`

  const senderDetails = isCurrentUser
    ? { type: 'me' }
    : { avatarUrl: sender?.user.avatar, firstName: displayName ?? 'Unknown' };

  const hasImage = message.contentType === 'image';

  return { hasImage, me: isCurrentUser, senderDetails };
}
