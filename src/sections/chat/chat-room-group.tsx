import { useState, useCallback, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { CollapseButton } from './styles';
import { ChatRoomParticipantDialog } from './chat-room-participant-dialog';
import { UserItem } from 'src/types/user';
import { useAuthContext } from 'src/auth/hooks';
import { Iconify } from 'src/components/iconify';
import { Box, Stack, Tooltip, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  participants: { user: UserItem }[];
  idOwner?: string;
};

export function ChatRoomGroup({ participants, idOwner }: Props) {
  const collapse = useBoolean(true);

  const { user } = useAuthContext();

  const [selected, setSelected] = useState<UserItem | null>(null);

  const handleOpen = useCallback((participant: UserItem) => {
    setSelected(participant);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  const totalParticipants = participants.length;

  const renderList = () => (
    <>
      {participants.map((participant) => (
        <ListItemButton key={participant.user.id}
          onClick={() => {
            participant.user.id !== user?.id &&
              handleOpen(participant.user)
          }
          }>
          <Badge variant={participant?.user.status === 'ACTIVE' ? 'online' : 'offline'} badgeContent="">
            <Avatar alt={participant.user.username} src={participant.user.avatar} />
          </Badge>
          <ListItemText
            primary={
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
                {participant.user.lastName} {participant.user.firstName}
                <Stack flexDirection={'row'} gap={1}>
                   {participant.user.id === user?.id && (
                    <Typography variant="caption" color="text.secondary">(Bạn)</Typography>
                  )}
                  {participant.user.id === idOwner && (
                    <Tooltip title="Trưởng nhóm">
                      <Iconify icon="fluent-color:people-home-24" width={16} />
                    </Tooltip>
                  )}
                </Stack>
              </Box>
            }
            secondary={participant.user.role?.name}
            slotProps={{
              primary: { noWrap: true },
              secondary: { noWrap: true, sx: { typography: 'caption' } },
            }}
            sx={{ ml: 2 }}
          />
        </ListItemButton>
      ))}
    </>
  );

  return (
    <>
      <CollapseButton
        selected={collapse.value}
        disabled={!totalParticipants}
        onClick={collapse.onToggle}
      >
        {`Thành viên tham gia (${totalParticipants})`}
      </CollapseButton>

      <Collapse in={collapse.value}>{renderList()}</Collapse>

      {selected && (
        <ChatRoomParticipantDialog participant={selected} open={!!selected} onClose={handleClose} />
      )}
    </>
  );
}
