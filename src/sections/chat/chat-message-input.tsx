import { useRef, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';


import { sendMessage } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { UserItem } from 'src/types/user';
import { IChatBodySender } from 'src/types/chat';
import { toast } from 'sonner';
import { ClickAwayListener, Popper } from '@mui/material';
import { socketChat } from 'src/lib/socket';
import { SOCKET_OUTGOING_EVENTS } from 'src/constants/socket-events';
// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  recipients: UserItem[];
  selectedConversationId: string;
  onAddRecipients: (recipients: UserItem[]) => void;
};

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  selectedConversationId,
}: Props) {
  const router = useRouter();

  const { user } = useAuthContext();

  const fileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const myContact: UserItem = useMemo(
    () => ({
      id: `${user?.id}`,
      role: { id: '', name: '' },
      email: `${user?.email}`,
      address: `${user?.address}`,
      username: `${user?.displayName}`,
      firstName: `${user?.displayName}`,
      lastName: `${user?.displayName}`,
      fullName: "",
      dob: '',
      gender: "MALE",
      code: '',
      avatar: `${user?.photoURL}`,
      phone: `${user?.phoneNumber}`,
      status: 'ACTIVE',
    }),
    [user]
  );

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  const open = Boolean(anchorEl);
  // const { messageData, conversationData } = initialConversation({
  //   message,
  //   recipients,
  //   me: myContact,
  // });

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;

    try {
      const preparedData: IChatBodySender = {
        conversationId: selectedConversationId,
        contentType: 'TEXT',
        body: message
      };

      await sendMessage(preparedData);
      socketChat.emit(SOCKET_OUTGOING_EVENTS.SEND_MESSAGE, message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setMessage('');
    }
  }, [message, selectedConversationId]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleKeyUp}
        onChange={handleChangeMessage}
        placeholder="Nhập nội dung..."
        disabled={disabled}
        startAdornment={
          <>
            {/* <IconButton onClick={handleEmojiClick}>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton> */}
            {/* <Popper open={open} anchorEl={anchorEl} placement="top-start" style={{ zIndex: 9999 }}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <div>
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
                </div>
              </ClickAwayListener>
            </Popper> */}
          </>
        }
        endAdornment={
          <Box sx={{ flexShrink: 0, display: 'flex' }}>
            <IconButton onClick={handleSend} disabled={!message}>
              <Iconify icon="fluent-color:send-20" />
            </IconButton>
            {/* <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton> */}
          </Box>
        }
        sx={[
          (theme) => ({
            px: 1,
            height: 56,
            flexShrink: 0,
            borderTop: `solid 1px ${theme.vars.palette.divider}`,
          }),
        ]}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
