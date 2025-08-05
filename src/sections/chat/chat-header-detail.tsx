import { startTransition, useCallback, useEffect, useState } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { ChatHeaderSkeleton } from './chat-skeleton';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import { UserItem } from 'src/types/user';
import { Button, Dialog, DialogTitle, Tooltip, Typography } from '@mui/material';
import { StudyGroupItem, studyGroupUpdateDTO } from 'src/types/studyGroup';
import ChatAddParticipant from './chat-add-participant';
import { UserType } from 'src/auth/types';
import ChatRenameGroup from './chat-rename-group';
import { toast } from 'sonner';
import { deleteStudyGroup, updateStudyGroup } from 'src/api/group';
import { UniqueIdentifier } from '@dnd-kit/core';
import { mutate } from 'swr';
import { endpoints } from 'src/lib/axios';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  participants: { user: UserItem }[];
  collapseNav: UseNavCollapseReturn;
  groupData?: StudyGroupItem;
  selectedGroupId?: string;
  userInfo?: UserType;
  selectedConversationId: string;
};

export function ChatHeaderDetail({ collapseNav, participants, loading, groupData, userInfo, selectedGroupId, selectedConversationId }: Props) {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const menuActions = usePopover();

  const router = useRouter();

  const isGroup = participants.length > 1;

  const singleParticipant = participants[0];

  const openRenamForm = useBoolean();

  const openDeleteForm = useBoolean();

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const [nameGroupChange, setNameGroupChange] = useState(groupData?.name || '');

  useEffect(() => {
    setNameGroupChange(groupData?.name || '')
  }, [groupData]);

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const handleRename = async () => {
    if (!selectedGroupId || !groupData) return;
    const idGr = selectedGroupId as UniqueIdentifier;
    const mem = groupData.members.map((m: any) => m.user);
    if (!mem) return;
    const mId = mem.map(m => m.id);
    try {
      const payload: studyGroupUpdateDTO = {
        channelId: groupData?.channel.id,
        name: nameGroupChange,
        members: mId
      };
      await updateStudyGroup(idGr, payload);
      toast.success('Đổi tên nhóm thành công');
      openRenamForm.onFalse();
      mutate(endpoints.conversation.list);
      mutate(endpoints.conversation.byId(selectedConversationId));
      mutate(endpoints.studyGroup(`/${selectedGroupId}`));
      mutate(endpoints.studyGroup(`?channelId=${groupData.channel.id}`));
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }

  const handleDeleteGroup = useCallback(async () => {
    try {
      await deleteStudyGroup(selectedGroupId as string);
      toast.success('Xóa nhóm thành công');
      startTransition(() =>
        router.push(paths.dashboard.channel.root)
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }, [selectedGroupId]);

  const renderGroup = () => {
    const hasOnlineUser = participants?.some((p) => p.user.status === 'ACTIVE');

    return (
      <Badge variant={hasOnlineUser ? 'online' : 'invisible'} badgeContent="">
        <AvatarGroup
          max={3}
          sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 } }}
        >
          {participants.map((participant) => (
            <Avatar
              key={participant.user.id}
              alt={participant.user.username}
              src={participant.user.avatar}
            />
          ))}
        </AvatarGroup>
      </Badge>
    );
  };

  const renderSingle = () => (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <Badge variant={singleParticipant?.user.status === 'ACTIVE' ? 'online' : 'offline'} badgeContent="">
        <Avatar src={singleParticipant?.user.avatar} alt={singleParticipant?.user.username} />
      </Badge>

      {singleParticipant?.user.lastName || singleParticipant?.user.firstName &&
        <ListItemText
          primary={`${singleParticipant?.user.lastName} ${singleParticipant?.user.firstName}`}
          secondary={
            singleParticipant?.user.status === "INACTIVE"
              ? 'Ngoại tuyến'
              : 'Đang hoạt động'
          }
        />
      }
    </Box>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  const renderDeletePops = (open: boolean, onClose: () => void, onDelete: () => Promise<void>) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Xác nhận giải tán nhóm?</DialogTitle>
        <Box px={4} pb={4}>
          <Typography variant='body2' color='text.disabled' fontWeight={500}>
            Sau khi giải tán nhóm bạn sẽ không được nhắn vào trong cuộc trò chuyện này được nữa!
          </Typography>
        </Box>
        <Box display={'flex'} px={4} pb={4} flexDirection={'row'} justifyContent={'flex-end'} gap={1}>
          <Button variant='outlined' onClick={onClose}>Đóng</Button>
          <Button variant='contained' onClick={onDelete}>Xác nhận</Button>
        </Box>
      </Dialog>
    )
  };

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        <MenuItem disabled onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:bell-off-bold" />
          Tắt thông báo
        </MenuItem>

        <MenuItem onClick={() => { menuActions.onClose(); openRenamForm.onTrue() }}>
          <Iconify icon="fluent:rename-24-filled" />
          Đổi tên nhóm
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {groupData &&
          <MenuItem onClick={() => { menuActions.onClose(); openDeleteForm.onTrue() }} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            {groupData ? 'Giải tán nhóm' : 'Xóa'}
          </MenuItem>
        }
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      {isGroup ? renderGroup() : renderSingle()}

      {groupData &&
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={(theme) => ({
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: theme.palette.warning.main,
            })}
          />
          <Typography variant="body1" fontWeight={700} color="textPrimary">
            {groupData.name}
          </Typography>
        </Box>
      }

      <Box sx={{
        // flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        {groupData?.owner.id === userInfo?.id &&
          <ChatAddParticipant
            conversationId={selectedConversationId}
            groupId={selectedGroupId || ''}
            channelId={groupData?.channel.id || ''}
            idOwner={groupData?.owner.id || ''}
          />
        }

        {/* <Tooltip title="Mở cuộc họp">
          <IconButton>
            <Iconify icon="fluent-color:video-16" />
          </IconButton>
        </Tooltip> */}

        <Tooltip title={collapseDesktop ? "Xem thông tin" : "Đóng thông tin"}>
          <IconButton onClick={handleToggleNav}>
            <Iconify
              icon={!collapseDesktop ? 'custom:sidebar-unfold-fill' : 'custom:sidebar-fold-fill'}
              color='#8381ff'
            />
          </IconButton>
        </Tooltip>

        <IconButton onClick={menuActions.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Box>

      <ChatRenameGroup
        open={openRenamForm.value}
        onClose={openRenamForm.onFalse}
        name={nameGroupChange}
        onSubmit={handleRename}
        onNameChange={setNameGroupChange}
      />

      {renderMenuActions()}
      {renderDeletePops(openDeleteForm.value, openDeleteForm.onFalse, handleDeleteGroup)}
    </>
  );
}
