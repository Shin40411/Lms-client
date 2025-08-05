import { DegreeType, validDegrees, type CreateOrUpdateUserDto, type UserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Dialog, DialogTitle, FormControl, FormLabel, IconButton, InputAdornment, MenuItem, Radio, RadioGroup } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { RoleItem } from 'src/types/role';
import { createUser, updateUser } from 'src/api/users';
import { useEffect, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { _mockYear } from 'src/_mock/_mockYear';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  avatarUrl: schemaHelper.file().optional(),

  firstName: zod.string().min(1, { message: 'Họ là bắt buộc!' }),
  lastName: zod.string().min(1, { message: 'Tên là bắt buộc!' }),

  dob: zod.date().optional(),

  gender: zod.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính là bắt buộc!' }),
  }),

  status: zod.enum(['ACTIVE', 'INACTIVE']),

  role: zod.string().min(1, { message: 'Vai trò là bắt buộc!' }),

  username: zod.string().min(1, { message: 'Tên đăng nhập là bắt buộc!' }),

  password: zod.string().min(8, 'Mật khẩu tối thiểu 8 ký tự!'),

  code: zod.string().optional(),

  teacherProfile: zod
    .object({
      degree: zod.enum(validDegrees),
    })
    .optional(),

  studentProfile: zod
    .object({
      academicYear: zod.string().min(1, 'Vui lòng nhập năm học'),
    })
    .optional(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser: UserItem | null;
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  roleDatas?: RoleItem[];
};

export function UserNewEditForm({ currentUser, open, onClose, onReset, roleDatas }: Props) {
  const showPassword = useBoolean();
  const [userType, setUserType] = useState<'' | 'TEACHER' | 'STUDENT'>('');

  const defaultValues: NewUserSchemaType = {
    avatarUrl: null,
    firstName: '',
    lastName: '',
    dob: new Date(),
    gender: 'OTHER',
    status: 'ACTIVE',
    role: '',
    username: '',
    password: '',
    code: '',
    teacherProfile: undefined,
    studentProfile: undefined,
  };

  const isValidDegree = (degree: string): degree is typeof validDegrees[number] => {
    return validDegrees.includes(degree as typeof validDegrees[number]);
  };

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues: currentUser
      ? {
        ...defaultValues,
        avatarUrl: currentUser.avatar || null,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        dob: currentUser.dob ? new Date(currentUser.dob) : new Date(),
        gender: currentUser.gender,
        status: currentUser.status,
        code: currentUser.code,
        role: currentUser.role.id,
        username: currentUser.username,
        password: '',
        teacherProfile:
          currentUser.teacherProfile &&
            isValidDegree(currentUser.teacherProfile.degree)
            ? {
              degree: currentUser.teacherProfile.degree as typeof validDegrees[number],
            }
            : undefined,
        studentProfile: undefined,
      }
      : defaultValues,
  });

  useEffect(() => {
    if (currentUser) setUserType('');
    if (currentUser) {
      methods.reset({
        ...defaultValues,
        avatarUrl: currentUser.avatar || null,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        dob: currentUser.dob ? new Date(currentUser.dob) : new Date(),
        gender: currentUser.gender,
        status: currentUser.status,
        code: currentUser.code,
        role: currentUser.role.id,
        username: currentUser.username,
        password: currentUser.password || '12345678',
      });
    } else {
      methods.reset(defaultValues);
    }
  }, [currentUser, methods.reset]);

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: CreateOrUpdateUserDto = {
        roleId: data.role,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob ? new Date(data.dob).toISOString() : '',
        code: currentUser?.code || '',
        status: data.status,
        avatar: typeof data.avatarUrl === 'string' ? data.avatarUrl : undefined,
        gender: data.gender,
        ...(currentUser ? {} : { password: data.password ?? '' }),
        ...(userType === 'TEACHER' ? { teacherProfile: data.teacherProfile } : {}),
        ...(userType === 'STUDENT' ? { studentProfile: data.studentProfile } : {}),
      };

      if (currentUser) {
        await updateUser(currentUser.id, payload);
      } else {
        await createUser(payload);
      }

      onReset();
      toast.success(currentUser ? 'Cập nhật dữ liệu thành công!' : 'Tạo mới thành công!');
      reset();
      onClose();
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
          sx: { maxWidth: 1440 },
        },
      }}
    >
      <DialogTitle>{currentUser ? 'Chỉnh sửa thông tin người dùng' : 'Tạo thông tin người dùng'}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3} sx={{ p: '10px' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              {currentUser && (
                <Label
                  color={
                    (values.status === 'ACTIVE' && 'success') ||
                    (values.status === 'INACTIVE' && 'error') ||
                    'warning'
                  }
                  sx={{ position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status === 'ACTIVE' ? (
                    <>
                      <Iconify icon="ri:account-circle-fill" color='#4e42d9' width={24} height={24} /> Đang hoạt động
                    </>
                  ) : (
                    <>
                      <Iconify icon="material-symbols-light:account-circle-off-rounded" color='#000' width={24} height={24} /> Không hoạt động
                    </>
                  )}
                </Label>
              )}

              <Box sx={{ mb: 5 }}>
                <Field.UploadAvatar
                  name="avatarUrl"
                  maxSize={3145728}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Cho phép *.jpeg, *.jpg, *.png, *.gif
                      <br /> Kích thước tối đa {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>

              {currentUser && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value === 'INACTIVE'}
                          onChange={(event) => field.onChange(event.target.checked ? 'INACTIVE' : 'ACTIVE')}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Vô hiệu hóa
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Tắt hoạt động người dùng này
                      </Typography>
                    </>
                  }
                  sx={{
                    mx: 0,
                    mt: 5,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />
              )}

              {/* <Field.Switch
                name="isVerified"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Xác minh email
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    </Typography> 
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              /> */}

              {/* {currentUser && (
                <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant="soft" color="error" startIcon={<Iconify icon="fluent-color:person-warning-48" />}>
                    Xóa người dùng
                  </Button>
                </Stack>
              )} */}
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: 1 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Field.Text name="lastName" label="Họ" sx={{ width: '30%' }} />
                  <Field.Text name="firstName" label="Tên" sx={{ width: '70%' }} />
                </Box>
                <Field.Text name="code" label="Mã số (Tùy chọn)" />
                <Field.DatePicker
                  name="dob"
                  label="Ngày sinh"
                />
                <Field.Select
                  size='medium'
                  label="Vai trò"
                  name="role"
                >
                  {roleDatas?.map((r) => (
                    <MenuItem
                      key={r.id}
                      value={r.id}
                    >
                      {r.name}
                    </MenuItem>
                  ))}
                </Field.Select>
                {/* <Field.Phone
                  country='VN'
                  name="phone"
                  label="Số điện thoại"
                  disableSelect
                /> */}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Field.Text name="username" label="Tên đăng nhập" />
                  {!currentUser && (
                    <Field.Text name="password" label="Mật khẩu"
                      type={showPassword.value ? 'text' : 'password'}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={showPassword.onToggle} edge="end">
                                <Iconify
                                  icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                </Box>
                {/* <Field.Text name="email" label="Địa chỉ email" /> */}
                {/* <Field.Text name="address" label="Địa chỉ" /> */}
                <Field.RadioGroup name="gender" label='Giới tính' options={[
                  { label: "Nam", value: "MALE" },
                  { label: "Nữ", value: "FEMALE" },
                  { label: "Khác", value: "OTHER" }
                ]} />


                {!currentUser && (
                  <FormControl>
                    <FormLabel>Loại người dùng (Tùy chọn)</FormLabel>
                    <RadioGroup
                      row
                      value={userType}
                      onChange={(e) => setUserType(e.target.value as 'TEACHER' | 'STUDENT')}
                    >
                      <FormControlLabel value="TEACHER" control={<Radio />} label="Giáo viên" />
                      <FormControlLabel value="STUDENT" control={<Radio />} label="Học sinh" />
                    </RadioGroup>
                  </FormControl>
                )}


                {userType === 'TEACHER' && (
                  <Field.Select name="teacherProfile.degree" label="Bằng cấp">
                    <MenuItem value="BACHELOR">Cử nhân</MenuItem>
                    <MenuItem value="MASTER">Thạc sĩ</MenuItem>
                    <MenuItem value="DOCTORATE">Tiến sĩ</MenuItem>
                    <MenuItem value="ORTHER">Khác</MenuItem>
                  </Field.Select>
                )}

                {userType === 'STUDENT' && (
                  <Field.Text
                    name="studentProfile.academicYear"
                    label="Niên khóa"
                    select
                    SelectProps={{ native: false }}
                  >
                    {_mockYear.map((g) => (
                      <MenuItem key={g} value={g}>
                        {g}
                      </MenuItem>
                    ))}
                  </Field.Text>
                )}

              </Box>
            </Card>
            <Stack direction="row" justifyContent="flex-end" sx={{ p: 4, alignItems: 'flex-end' }}>
              <Button variant="outlined" color="inherit" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button type="submit" variant="contained" sx={{ ml: 1 }} loading={isSubmitting}>
                {!currentUser ? 'Thêm dữ liệu' : 'Lưu thay đổi'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </Dialog>
  );
}
