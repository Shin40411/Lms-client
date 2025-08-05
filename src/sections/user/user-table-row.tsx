import type { IUserItem, UserItem } from 'src/types/user';

import { useBoolean, UseBooleanReturn, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';
import { UserNewEditForm } from './user-new-edit-form';
import { Dispatch, SetStateAction } from 'react';

// ----------------------------------------------------------------------

type Props = {
  row: UserItem;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  openEditForm: UseBooleanReturn;
  rowSelected: Dispatch<SetStateAction<UserItem | null>>;
};

export function UserTableRow({ row, selected, editHref, onSelectRow, onDeleteRow, openEditForm, rowSelected }: Props) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => {
          menuActions.onClose();
          openEditForm.onTrue();
          rowSelected(row)
        }}>
          <Iconify icon="fluent-color:edit-24" />
          Chỉnh sửa
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          disabled
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="fluent-color:dismiss-circle-28" />
          Xóa
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Xóa
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {/* <TableCell padding="checkbox"
          sx={{
            border: 'none',
          }}
        >
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                'aria-label': `${row.id} checkbox`,
              },
            }}
          />
        </TableCell> */}

        <TableCell sx={{
          border: 'none',
        }}>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.username} src={row.avatar} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {row.lastName} {row.firstName}
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.username}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ border: 'none', whiteSpace: 'nowrap' }}>{row.code}</TableCell>

        <TableCell sx={{ border: 'none', whiteSpace: 'nowrap' }}>
          {row.gender === 'MALE' ? 'Nam' : row.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
        </TableCell>

        <TableCell sx={{ border: 'none', whiteSpace: 'nowrap' }}>{row.role.name}</TableCell>

        <TableCell sx={{
          border: 'none',
        }}>
          <Label
            variant="soft"
            color={
              (row.status === 'ACTIVE' && 'success') ||
              (row.status === 'INACTIVE' && 'error') ||
              'default'
            }
          >
            {row.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
          </Label>
        </TableCell>

        <TableCell
          sx={{
            border: 'none',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow >

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
