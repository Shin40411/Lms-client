import { uuidv4 } from 'minimal-shared/utils';

import { fSub } from 'src/utils/format-time';
import { UserItem } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  message?: string;
  me: UserItem;
  recipients: UserItem[];
};

export function initialConversation({ message = '', recipients, me }: Props) {
  const isGroup = recipients.length > 1;

  const messageData = {
    id: uuidv4(),
    attachments: [],
    body: message,
    contentType: 'text',
    createdAt: fSub({ minutes: 1 }),
    senderId: me.id,
  };

  const conversationData = {
    id: isGroup ? uuidv4() : recipients[0]?.id,
    messages: [messageData],
    participants: [...recipients.map((r) => ({ user: r })), { user: me }],
    type: isGroup ? 'GROUP' : 'ONE_TO_ONE',
    unreadCount: 0,
  };

  return { messageData, conversationData };
}
