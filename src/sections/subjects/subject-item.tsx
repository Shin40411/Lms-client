import type { CardProps } from '@mui/material/Card';

import { UseBooleanReturn, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';


import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { SbjItem } from 'src/types/subject';
import { Dispatch, SetStateAction } from 'react';
import { Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

type Props = CardProps & {
  subject: SbjItem;
  onDelete: UseBooleanReturn;
  rowSelected: Dispatch<SetStateAction<SbjItem | null>>;
  openForm: UseBooleanReturn;
  setSelectedId: Dispatch<SetStateAction<string>>;
  openDetails: UseBooleanReturn;
};

export function SubjectItem({ subject, onDelete, rowSelected, openForm, setSelectedId, openDetails, sx, ...other }: Props) {
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => { openForm.onTrue(); rowSelected(subject); menuActions.onClose() }}>
          <Iconify icon="fluent-color:edit-24" />
          Chỉnh sửa
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDelete.onTrue();
            setSelectedId(subject.id);
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="fluent-color:dismiss-circle-32" />
          Xóa
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Card sx={sx} {...other}>
        <IconButton onClick={menuActions.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Tooltip title="Xem chi tiết môn" sx={{ p: 3, pb: 2, cursor: 'pointer' }}
          onClick={() => {
            setSelectedId(subject.id);
            menuActions.onClose();
            openDetails.onTrue()
          }}
        >
          <Box>
            <Iconify
              icon={'fluent-color:clipboard-text-edit-20'}
              sx={{ width: 48, height: 48, mb: 2 }}
            />

            <ListItemText
              sx={{ mb: 1 }}
              primary={
                <Typography fontWeight={600} color="inherit">
                  {subject.name}
                </Typography>
              }
              slotProps={{
                primary: { sx: { typography: 'subtitle1' } },
                secondary: {
                  sx: { mt: 1, typography: 'caption', color: 'text.disabled' },
                },
              }}
            />

            <Box
              sx={{
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
                typography: 'caption',
              }}
            >
              Mã môn học <strong>{subject.code}</strong>
            </Box>
          </Box>
        </Tooltip>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          sx={{
            p: 3,
            rowGap: 1.5,
          }}
        >
          <Box
            sx={{
              gap: 0.5,
              minWidth: 0,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={16} icon="fluent-color:text-edit-style-20" sx={{ flexShrink: 0 }} />
            <Typography variant="caption" noWrap>
              {subject.description || 'Không có mô tả'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {renderMenuActions()}
    </>
  );
}
