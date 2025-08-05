import type { IKanbanTask } from 'src/types/kanban';
import type { Transform } from '@dnd-kit/utilities';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';

import { memo, useEffect, useState } from 'react';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { Iconify } from 'src/components/iconify';
import { imageClasses } from 'src/components/image';

import { channelClasses } from './classes';
import { StudyGroupItem } from 'src/types/studyGroup';
import { CONFIG } from 'src/global-config';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { getStudyGroupById } from 'src/api/group';

// ----------------------------------------------------------------------

export type ItemBaseProps = React.ComponentProps<typeof ItemRoot> & {
  ref?: (node: HTMLElement | null) => void;
  task: StudyGroupItem;
  open?: boolean;
  stateProps?: {
    fadeIn?: boolean;
    sorting?: boolean;
    disabled?: boolean;
    dragging?: boolean;
    dragOverlay?: boolean;
    transition?: string | null;
    transform?: Transform | null;
    listeners?: DraggableSyntheticListeners;
  };
};

function ItemBase({ task, open, stateProps, ref, sx, ...other }: ItemBaseProps) {
  const { fadeIn, sorting, disabled, dragging, dragOverlay, transition, transform, listeners } =
    stateProps ?? {};

  const navigationChat = useRouter();

  useEffect(() => {
    if (!dragOverlay) {
      return;
    }

    document.body.style.cursor = 'grabbing';

    // eslint-disable-next-line consistent-return
    return () => {
      document.body.style.cursor = '';
    };
  }, [dragOverlay]);

  const renderPriority = () => (
    <Iconify
      icon={
        (task.status === 'ACTIVE' && 'unjs:node-fetch-native') ||
        'fluent-color:clock-48'
      }
      sx={{
        width: 13,
        top: 4,
        right: 4,
        position: 'absolute',
        ...(task.status === 'ACTIVE' && { color: 'info.main' }),
        ...(task.status === 'INACTIVE' && { color: 'error.main' }),
      }}
    />
  );

  const renderImage = () => {
    const avatarSrc = task?.owner.avatar;
    const fallbackAvatar = `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-25.webp`;
    const validAvatar = useValidImage(avatarSrc);
    return task?.owner && (
      <Box sx={[(theme) => ({ display: 'flex', gap: 2 })]}>
        <Box sx={{ width: '50px' }}>
          <ItemImage
            open={open}
            className={imageClasses.root}
            alt={task?.owner.username}
            src={validAvatar || fallbackAvatar}
          />
        </Box>
        <Stack flexDirection={'column'} gap={1}>
          {task.name}
          <Typography variant='caption' color='text.disabled' sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
            Đang có {task.members.length} thành viên tham gia
            <Iconify icon={'svg-spinners:3-dots-bounce'} />
          </Typography>
        </Stack>
      </Box>
    );
  };

  const handleRedirect = () => navigationChat.push(`${paths.dashboard.chatGroup}?id=${task.id}`);

  return (
    <ItemWrap
      ref={ref}
      className={mergeClasses([channelClasses.itemWrap], {
        [channelClasses.state.fadeIn]: fadeIn,
        [channelClasses.state.dragOverlay]: dragOverlay,
      })}
      style={{
        ...(!!transition && { transition }),
        ...(!!transform && {
          '--translate-x': `${Math.round(transform.x)}px`,
          '--translate-y': `${Math.round(transform.y)}px`,
          '--scale-x': `${transform.scaleX}`,
          '--scale-y': `${transform.scaleY}`,
        }),
      }}

      onClick={handleRedirect}
    >
      <ItemRoot
        className={mergeClasses([channelClasses.item], {
          [channelClasses.state.sorting]: sorting,
          [channelClasses.state.dragging]: dragging,
          [channelClasses.state.disabled]: disabled,
          [channelClasses.state.dragOverlay]: dragOverlay,
        })}
        data-cypress="draggable-item"
        tabIndex={0}
        sx={sx}
        {...listeners}
        {...other}
      >
        <ItemContent>
          {renderPriority()}
          {renderImage()}
          {/* {renderInfo()} */}
        </ItemContent>
      </ItemRoot>
    </ItemWrap>
  );
}

export default memo(ItemBase);

// ----------------------------------------------------------------------

const ItemWrap = styled('li')(() => ({
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  display: 'flex',
  transform:
    'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))',
  transformOrigin: '0 0',
  touchAction: 'manipulation',
  [`&.${channelClasses.state.fadeIn}`]: {
    animation: 'fadeIn 500ms ease',
  },
  [`&.${channelClasses.state.dragOverlay}`]: {
    zIndex: 999,
  },
}));

const ItemRoot = styled('div')(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  transformOrigin: '50% 50%',
  touchAction: 'manipulation',
  borderRadius: 'var(--item-radius)',
  WebkitTapHighlightColor: 'transparent',
  boxShadow: theme.vars.customShadows.z1,
  backgroundColor: theme.vars.palette.background.neutral,
  transition: theme.transitions.create(['box-shadow']),
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.grey[900],
  }),
  [`&.${channelClasses.state.disabled}`]: {},
  [`&.${channelClasses.state.sorting}`]: {},
  // When move item overlay
  [`&.${channelClasses.state.dragOverlay}`]: {
    backdropFilter: 'blur(6px)',
    boxShadow: theme.vars.customShadows.z20,
    backgroundColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.48),
    ...theme.applyStyles('dark', {
      backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48),
    }),
  },
  // Placeholder when dragging item
  [`&.${channelClasses.state.dragging}`]: {
    opacity: 0.2,
    filter: 'grayscale(1)',
  },
}));

const ItemContent = styled('div')(({ theme }) => ({
  ...theme.typography.subtitle2,
  position: 'relative',
  padding: theme.spacing(2.5, 2),
}));

const ItemImage = styled('img', {
  shouldForwardProp: (prop: string) => !['open', 'sx'].includes(prop),
})<Pick<ItemBaseProps, 'open'>>(({ theme }) => ({
  width: '100%',
  height: 'auto',
  // aspectRatio: '4/3',
  objectFit: 'cover',
  borderRadius: '50%',
  variants: [
    {
      props: { open: true },
      style: {
        opacity: 0.8,
      },
    },
  ],
}));

function useValidImage(src: string | undefined) {
  const [validSrc, setValidSrc] = useState<string>();

  useEffect(() => {
    if (!src) {
      setValidSrc(undefined);
      return;
    }

    const img = new Image();
    img.onload = () => setValidSrc(src);
    img.onerror = () => setValidSrc(undefined);
    img.src = src;
  }, [src]);

  return validSrc;
}
