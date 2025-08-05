import { Iconify } from 'src/components/iconify';

import type { AccountDrawerProps } from './components/account-drawer';

// ----------------------------------------------------------------------

export const _account: AccountDrawerProps['data'] = [
  { label: 'Trang chủ', href: '/', icon: <Iconify icon="fluent-color:people-home-32" /> },
  {
    label: 'Thông tin cá nhân',
    href: '/dashboard/user/account',
    icon: <Iconify icon="fluent-color:scan-person-24" />,
  },
  {
    label: 'Đổi mật khẩu',
    href: '/dashboard/user/account/change-password',
    icon: <Iconify icon="fluent-color:person-key-24" />,
  },
];
