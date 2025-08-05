import type { CardProps } from '@mui/material/Card';

import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    subheader: 'Thông báo chính',
    caption: 'Thiết lập các thông báo về khoá học, bài thi,...',
    items: [
      { id: 'activity_comments', label: 'Gửi thông báo khi có người bình luận vào bài viết của tôi' },
      { id: 'activity_answers', label: 'Gửi thông báo khi có người trả lời biểu mẫu của tôi' },
      { id: 'activityFollows', label: 'Gửi thông báo khi có người theo dõi tôi' },
    ],
  },
  {
    subheader: 'Thông báo phụ',
    caption: 'Thiết lập các thông báo không quan trọng',
    items: [
      { id: 'application_news', label: 'Tin tức và thông báo' },
      { id: 'application_product', label: 'Cập nhật lớp học hàng tuần' },
      { id: 'application_blog', label: 'Bản cập nhật hàng tuần' },
    ],
  },
];

// ----------------------------------------------------------------------

export function AccountNotifications({ sx, ...other }: CardProps) {
  const methods = useForm({
    defaultValues: { selected: ['activity_comments', 'application_product'] },
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <Box sx={{ width: '100%' }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Box
          sx={[
            {
              p: 3,
              gap: 3,
              display: 'flex',
              flexDirection: 'column',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...other}
        >
          {NOTIFICATIONS.map((notification) => (
            <Grid key={notification.subheader} container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <ListItemText
                  primary={notification.subheader}
                  secondary={notification.caption}
                  slotProps={{
                    primary: { sx: { typography: 'h6' } },
                    secondary: { sx: { mt: 0.5 } },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Box
                  sx={{
                    p: 3,
                    gap: 1,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.neutral',
                  }}
                >
                  <Controller
                    name="selected"
                    control={control}
                    render={({ field }) => (
                      <>
                        {notification.items.map((item) => (
                          <FormControlLabel
                            key={item.id}
                            label={item.label}
                            labelPlacement="start"
                            control={
                              <Switch
                                checked={field.value.includes(item.id)}
                                onChange={() => field.onChange(getSelected(values.selected, item.id))}
                                slotProps={{
                                  input: {
                                    id: `${item.label}-switch`,
                                    'aria-label': `${item.label} switch`,
                                  },
                                }}
                              />
                            }
                            sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                          />
                        ))}
                      </>
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          ))}

          <Button type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
            Lưu thay đổi
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
