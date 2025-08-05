import type { Theme, SxProps } from '@mui/material/styles';
import type { AnimateLayoutChanges } from '@dnd-kit/sortable';
import type { IKanbanTask, IKanbanColumn } from 'src/types/kanban';

import { useCallback, useEffect } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useBoolean } from 'minimal-shared/hooks';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';

import { createTask, clearColumn, deleteColumn, updateColumn } from 'src/actions/kanban';

import { toast } from 'src/components/snackbar';

import ColumnBase from './column-base';
import { ChannelAdd } from './channel-add';
import { ChannelColumnToolBar } from './channel-column-toolbar';
import { ChannelItem } from 'src/types/channel';
import { StudyGroupDTO, StudyGroupItem } from 'src/types/studyGroup';
import { createStudyGroup } from 'src/api/group';
import { useAuthContext } from 'src/auth/hooks';
import { mutate } from 'swr';
import { endpoints } from 'src/lib/axios';
import { deleteChannel, updateChannel } from 'src/api/channel';

// ----------------------------------------------------------------------

type ColumnProps = {
  disabled?: boolean;
  sx?: SxProps<Theme>;
  tasks: StudyGroupItem[];
  column: ChannelItem;
  children: React.ReactNode;
  openForm: (id: string) => void;
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export function ChannelColumn({ children, column, tasks, disabled, openForm, sx }: ColumnProps) {
  const openAddTask = useBoolean();
  const { user } = useAuthContext();

  const { attributes, listeners, setNodeRef, transition, active, over, transform } =
    useSortable({
      id: column.id,
      data: { type: 'container', children: tasks },
      animateLayoutChanges,
    });

  const tasksIds = tasks.map((task) => task.id);

  const isOwner = user?.id === column.owner.id;

  const isOverContainer = over
    ? (column.id === over.id && active?.data.current?.type !== 'container') ||
    tasksIds.includes(over.id)
    : false;

  const handleUpdateColumn = useCallback(
    async (columnName: string) => {
      try {
        if (column.name !== columnName) {
          const payload = {
            name: columnName,
            type: 'GROUP',
          }
          await updateChannel(column.id, payload);
          toast.success('Đổi tên kênh thành công!', { position: 'top-center' });
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra!');
        console.error(error);
      }
    },
    [column.id, column.name]
  );

  const handleClearColumn = useCallback(async () => {
    try {
      clearColumn(column.id);
    } catch (error) {
      console.error(error);
    }
  }, [column.id]);

  const handleDeleteColumn = useCallback(async () => {
    try {
      if (!column.id) return;
      await deleteChannel(column.id);
      toast.success('Xóa kênh thành công!', { position: 'top-center' });
      mutate(endpoints.channel(''));
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }, [column.id]);

  const handleAddTask = useCallback(
    async (bodyData: StudyGroupDTO) => {
      try {
        await createStudyGroup(bodyData);
        openAddTask.onFalse();
        mutate(endpoints.channel(''));
        toast.success('Tạo nhóm học tập thành công')
      } catch (error: any) {
        toast.error(error?.message);
        console.error(error);
      }
    },
    [column.id, openAddTask]
  );

  return (
    <ColumnBase
      ref={disabled ? undefined : setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      sx={sx}
      stateProps={{
        overContainer: isOverContainer,
        handleProps: { ...attributes, ...listeners },
      }}
      slots={{
        header: (
          <ChannelColumnToolBar
            handleProps={{ ...attributes, ...listeners }}
            totalTasks={tasks.length}
            columnName={column.name}
            onUpdateColumn={handleUpdateColumn}
            onClearColumn={handleClearColumn}
            onDeleteColumn={handleDeleteColumn}
            onToggleAddTask={openAddTask.onToggle}
            isOwner={isOwner}
            openForm={openForm}
            idChannel={column.id}
          />
        ),
        main: children,
        action: (
          <ChannelAdd
            status={column.name}
            channelId={column.id}
            openAddTask={openAddTask.value}
            onAddTask={handleAddTask}
            onCloseAddTask={openAddTask.onFalse}
          />
        ),
      }}
    />
  );
}
