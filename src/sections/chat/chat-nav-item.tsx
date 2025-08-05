import type { IChatConversation } from 'src/types/chat';

import { useCallback, startTransition, useState, useMemo, useEffect } from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fToNow, fToNowVN } from 'src/utils/format-time';

import { clickConversation, useGetConversation } from 'src/actions/chat';

import { useAuthContext, useMockedUser } from 'src/auth/hooks';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useNavItem } from './utils/useNavItem';
import { getUser } from 'src/api/users';
import { StudyGroupItem } from 'src/types/studyGroup';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  collapse: boolean;
  onCloseMobile: () => void;
  idGroup?: UniqueIdentifier;
  conversationGroup: IChatConversation;
  grData?: StudyGroupItem;
};

export function ChatNavItem({ selected, collapse, conversationGroup, idGroup, onCloseMobile, grData }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  if (!conversationGroup?.id) {
    return <ChatNavItemSkeleton />;
  }

  const conversationId = useMemo(() => conversationGroup?.id, [conversationGroup]);
  const { conversation } = useGetConversation(conversationId || '');
  const dataGroupFetched = grData?.members;

  if (!conversation) return <ChatNavItemSkeleton />;
  const {
    group,
    displayName,
    displayText,
    participants,
    lastActivity,
    hasOnlineInGroup,
  } = useNavItem({ conversation, currentUserId: `${user?.id}`, dataGroupFetched });

  const singleParticipant = participants[0];
  const handleClickConversation = () => {
    if (!mdUp) {
      onCloseMobile();
    }

    const redirectPath = conversationGroup
      ? `${paths.dashboard.chatGroup}?id=${idGroup}`
      : `${paths.dashboard.chat}`;

    startTransition(() => {
      router.push(redirectPath);
    });
  };

  const renderGroup = () => {
    if (!dataGroupFetched) return null;
    if (dataGroupFetched.length > 0 && participants.length > 0) {
      return (
        <Badge variant={hasOnlineInGroup ? 'online' : 'invisible'} badgeContent="">
          <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
            {dataGroupFetched.slice(0, 2).map((participant) => (
              <Avatar
                key={participant.id}
                alt={participant.username}
                src={participant.avatar}
              />
            ))}
          </AvatarGroup>
        </Badge>
      );
    }

    const fallbackUser = conversation.participants?.[0]?.user;
    return fallbackUser ? (
      <Badge
        variant={singleParticipant?.user.status === 'ACTIVE' ? 'online' : 'invisible'}
        badgeContent=""
      >
        <Avatar
          alt={fallbackUser.username}
          src={fallbackUser.avatar}
          sx={{ width: 48, height: 48 }}
        />
      </Badge>
    ) : null;
  };

  const renderSingle = () => (
    <Badge variant={singleParticipant?.user.status === 'ACTIVE' ? 'online' : 'offline'} badgeContent="">
      <Avatar
        alt={singleParticipant?.user.username}
        src={singleParticipant?.user.avatar}
        sx={{ width: 48, height: 48 }}
      />
    </Badge>
  );

  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          ...(selected && { bgcolor: 'action.selected' }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? conversation.unreadCount : 0}
        >
          {group ? renderGroup() : renderSingle()}
        </Badge>

        {!collapse && (
          <>
            <ListItemText
              primary={displayName}
              secondary={displayText || 'Chưa có tin nhắn'}
              slotProps={{
                primary: { noWrap: true },
                secondary: {
                  noWrap: true,
                  sx: {
                    ...(conversation.unreadCount && {
                      color: 'text.primary',
                      fontWeight: 'fontWeightSemiBold',
                    }),
                  },
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignSelf: 'stretch',
                alignItems: 'flex-end',
                flexDirection: 'column',
              }}
            >
              {lastActivity &&
                <Typography
                  noWrap
                  variant="body2"
                  component="span"
                  sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
                >
                  {fToNowVN(lastActivity)}
                </Typography>
              }

              {!!conversation.unreadCount && (
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'info.main',
                  }}
                />
              )}
            </Box>
          </>
        )}
      </ListItemButton>
    </Box>
  );
}
