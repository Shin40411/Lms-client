import type { DashboardContentProps } from 'src/layouts/dashboard';

import { removeLastSlash } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import HeaderSection from 'src/components/header-section/HeaderSection';
import { Card, Divider, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    label: 'Hồ sơ',
    icon: <Iconify width={24} icon="fluent-color:contact-card-16" />,
    href: paths.dashboard.user.account,
  },
  {
    label: 'Thông báo',
    icon: <Iconify width={24} icon="fluent-color:mail-alert-24" />,
    href: `${paths.dashboard.user.account}/notifications`,
  },
  {
    label: 'Đổi mật khẩu',
    icon: <Iconify width={24} icon="fluent-color:shield-checkmark-24" />,
    href: `${paths.dashboard.user.account}/change-password`,
  },
];

// ----------------------------------------------------------------------

export function AccountLayout({ children, ...other }: DashboardContentProps) {
  const pathname = usePathname();

  return (
    <DashboardContent {...other}>
      <HeaderSection
        heading="Thông tin cá nhân"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Thông tin cá nhân', href: paths.dashboard.user.account },
          {
            name:
              pathname.includes('notifications')
                ? 'Thông báo'
                : pathname.includes('change-password')
                  ? 'Đổi mật khẩu'
                  : 'Hồ sơ',
          },
        ]}
      />

      <Card sx={{ p: 4 }}>
        <Stack display={'flex'} flexDirection={'row'} justifyContent={'center'}>
          {children}
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Tabs
              orientation="vertical"
              value={removeLastSlash(pathname)}
              sx={{
                mb: { xs: 3, md: 5 },
                minWidth: 220,
                '& .MuiTabs-list': {
                  gap: '24px',
                },
              }}
            >
              {NAV_ITEMS.map((tab) => (
                <Tab
                  component={RouterLink}
                  key={tab.href}
                  label={tab.label}
                  icon={tab.icon}
                  value={tab.href}
                  href={tab.href}
                  sx={{ alignItems: 'center', justifyContent: 'flex-start' }}
                />
              ))}
            </Tabs>
        </Stack>
      </Card>
    </DashboardContent>
  );
}
