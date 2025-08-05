import type { IUserItem, UserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  country: schemaHelper.nullableInput(zod.string().min(1, { message: 'Country is required!' }), {
    // message for null value
    message: 'Country is required!',
  }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  company: zod.string().min(1, { message: 'Company is required!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: UserItem;
};

export function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const defaultValues: UserQuickEditSchemaType = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    status: '',
    company: '',
    role: '',
  };

  const methods = useForm<UserQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
    // values: currentUser,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Text name="lastName" label="Họ" />
            <Field.Text name="firstName" label="Tên" />
            <Field.Select name="status" label="Trạng thái">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="email" label="Địa chỉ Email" />
            <Field.Phone name="phoneNumber" label="Số điện thoại" />
            <Field.Text name="role" label="Vai trò" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
