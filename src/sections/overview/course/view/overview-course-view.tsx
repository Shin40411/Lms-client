import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { DashboardContent } from 'src/layouts/dashboard';
import { _coursesContinue, _coursesFeatured, _coursesReminder } from 'src/_mock';

import { CourseFeatured } from '../course-featured';
import { Button, Container, Divider } from '@mui/material';
import HeaderSection from 'src/components/header-section/HeaderSection';
import { paths } from 'src/routes/paths';
import CourseListFiltered from '../course-list-filtered';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function OverviewCourseView() {
  return (
    <DashboardContent
      maxWidth={false}
      disablePadding
      sx={[
        (theme) => ({
          borderTop: { lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}` },
        }),
      ]}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: { xs: 'column', lg: 'row' } }}>
        <Box
          sx={[
            (theme) => ({
              gap: 3,
              display: 'flex',
              minWidth: { lg: 0 },
              py: { lg: 3, xl: 5 },
              flexDirection: 'column',
              flex: { lg: '1 1 auto' },
              px: { xs: 2, sm: 3, xl: 5 },
              borderRight: {
                lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
              },
            }),
          ]}
        >
          <HeaderSection
            heading="Học trực tuyến"
            links={[
              { name: 'Tổng quan', href: paths.dashboard.root },
              { name: 'Học trực tuyến' },
            ]}
          />
          <Card>
            <Container maxWidth="xl">
              <CourseFeatured title="Các khóa học nổi bật" list={_coursesFeatured} sx={{ position: 'relative' }} />
            </Container>
            <Box display={'flex'} justifyContent={'center'}>
              <Divider
                orientation="horizontal"
                sx={{
                  width: '80%',
                  my: 2,
                }}
              />
            </Box>
            <Box>
              <CourseListFiltered courses={_coursesFeatured} />
            </Box>
          </Card>
        </Box>

        {/* <Box
          sx={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 2, sm: 3, xl: 5 },
            pt: { lg: 8, xl: 10 },
            pb: { xs: 8, xl: 10 },
            flexShrink: { lg: 0 },
            gap: { xs: 3, lg: 5, xl: 8 },
            maxWidth: { lg: 320, xl: 360 },
            bgcolor: { lg: 'background.neutral' },
            [`& .${cardClasses.root}`]: {
              p: { xs: 3, lg: 0 },
              boxShadow: { lg: 'none' },
              bgcolor: { lg: 'transparent' },
            },
          }}
        >
          <CourseMyAccount />

          <CourseMyStrength
            title="Strength"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [{ data: [80, 50, 30, 40, 100, 20] }],
            }}
          />

          <CourseReminders title="Reminders" list={_coursesReminder} />
        </Box> */}
      </Box>
    </DashboardContent>
  );
}
