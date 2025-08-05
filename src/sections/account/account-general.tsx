import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { CONFIG } from 'src/global-config';
import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, MenuItem, Tooltip } from '@mui/material';
import { UpdateProfileParams } from 'src/types/user';
import { updateProfile } from 'src/auth/context/jwt';
import { Iconify } from 'src/components/iconify';
import { useState } from 'react';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'Tên là bắt buộc!' }),
  lastName: zod.string().min(1, { message: 'Họ là bắt buộc!' }),
  gender: zod.enum(['MALE', 'FEMALE', 'OTHER'], {
    required_error: 'Giới tính là bắt buộc!',
  }),

  email: zod.string().email({ message: 'Email không hợp lệ!' }).optional(),
  avatar: schemaHelper.file().optional(),
  phone: zod.string()
    .optional()
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: 'Số điện thoại không đúng định dạng',
    }),
  address: zod.string().optional(),
  dob: zod.date().optional(),
  description: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  // const [rolesData, setRolesData] = useState<RoleItem[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { user } = useAuthContext();

  const currentUser: UpdateUserSchemaType = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    address: user?.address?.address || '',
    dob: user?.dob ? new Date(user.dob) : new Date(),
    gender: user?.gender ?? "MALE",
    description: user?.description
  };

  const defaultValues: UpdateUserSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    avatar: null,
    phone: '',
    address: '',
    dob: new Date(),
    gender: 'MALE',
    description: ''
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: UpdateUserSchemaType) => {
    try {
      let avatarFileName: string | undefined;

      if (data.avatar instanceof File) {
        avatarFileName = data.avatar.name;
      } else if (typeof data.avatar === 'string') {
        avatarFileName = data.avatar;
      }
      const payload: UpdateProfileParams = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        avatar: avatarFileName,
        dob: data.dob?.toDateString(),
        description: data.description,
        phone: data.phone,
        gender: data.gender,
        address: {
          address: data.address,
          ward: 'Không có',
          district: 'Không có',
          province: 'Không có',
          country: 'Không có',
          postalCode: 'Không có',
        },
      };

      await updateProfile(payload);
      toast.success('Cập nhật thông tin tài khoản thành công!');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
      console.error(error);
    }
  };

  // const fetchRoles = async () => {
  //   try {
  //     const data = await getRoles();
  //     setRolesData(data.results || []);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // useEffect(() => {
  //   fetchRoles();
  // }, []);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid spacing={3}>
            <Grid size={12}>
              <Box sx={{
                position: 'relative',
                height: '100%',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                borderRadius: 5,
                m: '0 20px 40px'
              }}>
                <Box
                  sx={{
                    pt: 10,
                    pb: 5,
                    textAlign: 'center',
                    backgroundImage: `url("${CONFIG.assetsDir}/assets/background/bgprofile.jpg")`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    height: '100%',
                    minHeight: '25vh',
                    borderRadius: 5
                  }}
                />
                <Field.UploadAvatar
                  name="avatar"
                  maxSize={3145728}
                  sx={{ position: 'absolute', bottom: -15, left: '5%', background: '#fff', border: 'none' }}
                />

                <Tooltip title="Tên tài khoản" sx={{ position: 'absolute', top: '10%', right: '2%', cursor: 'help' }}>
                  <Chip label={user?.username} color='success' />
                </Tooltip>
                <Tooltip title="Vai trò tài khoản" sx={{ position: 'absolute', top: '30%', right: '2%', cursor: 'help' }}>
                  <Chip avatar={<Iconify icon="fluent-color:premium-28" />} label={user?.role?.name} />
                </Tooltip>

              </Box>
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    rowGap: 3,
                    columnGap: 2,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Stack direction={'row'} gap={1}>
                    <Field.Text name="lastName" label="Họ" sx={{ width: '30%' }} />
                    <Field.Text name="firstName" label="Tên" sx={{ width: '70%' }} />
                  </Stack>
                  <Stack direction={'row'} gap={1}>
                    <Field.Select sx={{ width: '30%' }} name="gender" label="Giới tính" >
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      <MenuItem key="MALE" value="MALE">
                        Nam
                      </MenuItem>
                      <MenuItem key="FEMALE" value="FEMALE">
                        Nữ
                      </MenuItem>
                      <MenuItem key="OTHER" value="OTHER">
                        Khác
                      </MenuItem>
                    </Field.Select>
                    <Field.Phone sx={{ width: '70%' }} name="phone" label="Số điện thoại" country='VN' disableSelect />
                  </Stack>
                  <Field.Text name="email" label="Địa chỉ email" />
                  <Field.DatePicker name="dob" label="Ngày sinh" />
                </Box>

                <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                  <Field.Text name="address" label="Địa chỉ, số nhà,..." />
                  <Field.Text multiline name="description" label="Mô tả..." rows={4} />
                  <Button type="button" onClick={() => setOpenConfirm(true)} variant="contained" loading={isSubmitting}>
                    Lưu thay đổi
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </Box>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận thay đổi</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn lưu các thay đổi không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenConfirm(false);
              handleSubmit(onSubmit)();
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
