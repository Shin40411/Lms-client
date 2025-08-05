import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled, _coursesFeatured, _bookingNew, _coursesContinue } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';

import { useMockedUser } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppNewInvoice } from '../app-new-invoice';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopRelated } from '../app-top-related';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';
import { AppTopInstalledCountries } from '../app-top-installed-countries';
import { CourseFeatured } from '../../course/course-featured';
import { BookingNewest } from '../../booking/booking-newest';
import { CourseWidgetSummary } from '../../course/course-widget-summary';
import { CONFIG } from 'src/global-config';
import { CourseContinue } from '../../course/course-continue';
import { CalendarView } from 'src/sections/calendar/view';
import { CourseHoursSpent } from '../../course/course-hours-spent';
import { CourseProgress } from '../../course/course-progress';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 12 }} sx={{ mt: 3 }}>
          {/* thống kê kênh, nhóm, khoá học */}
          <Box
            sx={{
              gap: 3,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            <CourseWidgetSummary
              title="Courses in progress"
              total={6}
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
            />

            <CourseWidgetSummary
              title="Courses completed"
              total={3}
              color="success"
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-completed.svg`}
            />

            <CourseWidgetSummary
              title="Certificates"
              total={2}
              color="secondary"
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-certificates.svg`}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* giới thiệu các tính năng nổi bật */}
          <AppFeatured list={_appFeatured} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {/* thống kê tiến độ khoá học */}
          <CourseContinue title="Continue course" list={_coursesContinue} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CourseProgress
            title="Course progress"
            chart={{
              series: [
                { label: 'To start', value: 45 },
                { label: 'In progress', value: 25 },
                { label: 'Completed', value: 20 },
              ],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <CourseHoursSpent
            title="Hours spent"
            chart={{
              series: [
                {
                  name: 'Weekly',
                  categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                  data: [{ data: [10, 41, 35, 151, 49] }],
                },
                {
                  name: 'Monthly',
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  data: [{ data: [83, 112, 119, 88, 103, 112, 114, 108, 93] }],
                },
                {
                  name: 'Yearly',
                  categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
                  data: [{ data: [24, 72, 64, 96, 76, 41] }],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent >
  );
}
