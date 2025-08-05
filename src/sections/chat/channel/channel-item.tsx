import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Theme, SxProps } from '@mui/material/styles';

import { useSortable } from '@dnd-kit/sortable';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import { deleteTask, updateTask } from 'src/actions/kanban';

import { toast } from 'src/components/snackbar';

import ItemBase from './item-base';
import { StudyGroupItem } from 'src/types/studyGroup';

// ----------------------------------------------------------------------

type TaskItemProps = {
  disabled?: boolean;
  sx?: SxProps<Theme>;
  group: StudyGroupItem;
  columnId: UniqueIdentifier;
};

export function ChannelItemView({ group, disabled, columnId, sx }: TaskItemProps) {
  const channelDetailsDialog = useBoolean();

  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id: group?.id,
  });

  const handleDeleteChannel = useCallback(async () => {
    try {
      deleteTask(columnId, group.id);
      toast.success('Delete success!', { position: 'top-center' });
    } catch (error) {
      console.error(error);
    }
  }, [columnId, group.id]);

  return (
    <>
      <ItemBase
        ref={disabled ? undefined : setNodeRef}
        task={group}
        sx={sx}
      />
    </>
  );
}