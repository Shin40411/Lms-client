import type { BoxProps } from '@mui/material/Box';

import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, UseBooleanReturn, usePopover } from 'minimal-shared/hooks';
import { useId, useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { ChannelInputName } from './channel-input-name';


// ----------------------------------------------------------------------

type Props = BoxProps & {
  handleProps?: any;
  totalTasks?: number;
  columnName: string;
  onClearColumn?: () => void;
  onDeleteColumn?: () => void;
  onToggleAddTask?: () => void;
  onUpdateColumn?: (inputName: string) => void;
  isOwner: boolean;
  idChannel: string;
  openForm: (id: string) => void;
};

export function ChannelColumnToolBar({
  sx,
  columnName,
  totalTasks,
  handleProps,
  onClearColumn,
  onToggleAddTask,
  onDeleteColumn,
  onUpdateColumn,
  openForm,
  isOwner,
  idChannel
}: Props) {
  const inputId = useId();

  const renameRef = useRef<HTMLInputElement>(null);

  const menuActions = usePopover();
  const confirmDialog = useBoolean();

  const [name, setName] = useState(columnName);

  useEffect(() => {
    if (menuActions.open) {
      if (renameRef.current) {
        renameRef.current.focus();
      }
    }
  }, [menuActions.open]);

  const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleKeyUpUpdateColumn = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (renameRef.current) {
          renameRef.current.blur();
        }
        onUpdateColumn?.(name);
      }
    },
    [name, onUpdateColumn]
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            menuActions.onClose();
          }}
          sx={{ display: 'none' }}
        >
          <Iconify icon="fluent-color:drafts-24" />
          Đổi tên kênh
        </MenuItem>
        <MenuItem onClick={() => { menuActions.onClose(); openForm(idChannel) }}>
          <Iconify icon="fluent-color:edit-20" />
          Chỉnh sửa kênh
        </MenuItem>
        <MenuItem onClick={confirmDialog.onTrue}>
          <Iconify icon="fluent-color:dismiss-circle-16" />
          Xóa kênh
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Xác nhận xóa kênh"
      content={
        <>
          Bạn có chắc chắn muốn xóa kênh?
          <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
            <strong> LƯU Ý: </strong> Tất cả các nhóm liên quan đến kênh này cũng sẽ bị xóa.
          </Box>
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDeleteColumn?.();
            confirmDialog.onFalse();
          }}
        >
          Xác nhận
        </Button>
      }
    />
  );

  return (
    <>
      <Box sx={[{ display: 'flex', alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}>
        <Label
          sx={[
            (theme) => ({
              borderRadius: '50%',
              borderColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.24),
            }),
          ]}
        >
          {totalTasks}
        </Label>

        <ChannelInputName
          title={columnName}
          inputRef={renameRef}
          placeholder="Nhập tên kênh"
          value={name}
          onChange={handleChangeName}
          onKeyUp={handleKeyUpUpdateColumn}
          inputProps={{ id: `${columnName}-${inputId}-column-input` }}
          sx={{ mx: 1 }}
        />

        <IconButton size="small" color="inherit" onClick={onToggleAddTask}>
          <Iconify icon="solar:add-circle-bold" />
        </IconButton>
        {isOwner &&
          <IconButton
            size="small"
            color={menuActions.open ? 'inherit' : 'default'}
            onClick={menuActions.onOpen}
          >
            <Iconify icon="solar:menu-dots-bold-duotone" />
          </IconButton>
        }
      </Box>
      {isOwner && renderMenuActions()}

      {renderConfirmDialog()}
    </>
  );
}
