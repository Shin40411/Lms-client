import type { IKanbanTask } from 'src/types/kanban';

import { uuidv4 } from 'minimal-shared/utils';
import { useMemo, useState, useCallback } from 'react';

import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';

import { fAdd, today } from 'src/utils/format-time';

import { _mock } from 'src/_mock';
import { StudyGroupDTO } from 'src/types/studyGroup';

// ----------------------------------------------------------------------

type Props = {
  status: string;
  openAddTask: boolean;
  channelId: string;
  onCloseAddTask: () => void;
  onAddTask: (task: StudyGroupDTO) => void;
};

export function ChannelAdd({ status, channelId, openAddTask, onAddTask, onCloseAddTask }: Props) {
  const [taskName, setTaskName] = useState('');

  const defaultTask: StudyGroupDTO = useMemo(
    () => ({
      channelId: channelId,
      name: taskName.trim() ? taskName : 'Chưa đặt tên nhóm',
      members: []
    }),
    [status, taskName]
  );

  const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  }, []);

  const handleKeyUpAddTask = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onAddTask(defaultTask);
        setTaskName('');
      }
    },
    [defaultTask, onAddTask]
  );

  const handleCancel = useCallback(() => {
    setTaskName('');
    onCloseAddTask();
  }, [onCloseAddTask]);

  if (!openAddTask) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={handleCancel}>
      <div>
        <Paper
          sx={[
            (theme) => ({
              borderRadius: 1.5,
              bgcolor: 'background.default',
              boxShadow: theme.vars.customShadows.z1,
            }),
          ]}
        >
          <InputBase
            autoFocus
            fullWidth
            placeholder="Vui lòng đặt tên nhóm học tập"
            value={taskName}
            onChange={handleChangeName}
            onKeyUp={handleKeyUpAddTask}
            sx={{
              px: 2,
              height: 56,
              [`& .${inputBaseClasses.input}`]: { p: 0, typography: 'subtitle2' },
            }}
          />
        </Paper>

        <FormHelperText sx={{ mx: 1 }}>Nhấn Enter để tạo nhóm học tập.</FormHelperText>
      </div>
    </ClickAwayListener>
  );
}
