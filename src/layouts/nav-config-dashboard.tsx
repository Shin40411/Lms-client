import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

/**
 * Input nav data is an array of navigation section items used to define the structure and content of a navigation bar.
 * Each section contains a subheader and an array of items, which can include nested children items.
 *
 * Each item can have the following properties:
 * - `title`: The title of the navigation item.
 * - `path`: The URL path the item links to.
 * - `icon`: An optional icon component to display alongside the title.
 * - `info`: Optional additional information to display, such as a label.
 * - `allowedRoles`: An optional array of roles that are allowed to see the item.
 * - `caption`: An optional caption to display below the title.
 * - `children`: An optional array of nested navigation items.
 * - `disabled`: An optional boolean to disable the item.
 */
export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'Chung',
    items: [
      { title: 'Tổng quan', path: paths.dashboard.root, icon: <Iconify icon={'fluent-color:gauge-20'} /> },
      // { title: 'Ecommerce', path: paths.dashboard.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
      // { title: 'Banking', path: paths.dashboard.general.banking, icon: ICONS.banking },
      // { title: 'Booking', path: paths.dashboard.general.booking, icon: ICONS.booking },
      // { title: 'File', path: paths.dashboard.general.file, icon: ICONS.file },
      // { title: 'Course', path: paths.dashboard.general.course, icon: ICONS.course },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Quản lý',
    items: [
      {
        title: 'Lớp học',
        path: paths.dashboard.classes.root,
        icon: <Iconify icon={'fluent-color:people-community-24'} />,
      },
      {
        title: 'Môn học',
        path: paths.dashboard.subjects.root,
        icon: <Iconify icon={'fluent-color:book-open-lightbulb-24'} />,
      },
      {
        title: 'Khóa học',
        path: paths.dashboard.course.list,
        icon: <Iconify icon={'fluent-color:slide-text-sparkle-24'} />,
      },
      {
        title: 'Bài thi',
        path: paths.dashboard.exams.root,
        icon: <Iconify icon={'fluent-color:document-folder-24'} />,
      },
    ],
  },
  /**
   * Item state
   */
  {
    subheader: 'Ứng dụng',
    items: [
      // {
      //   title: 'Permission',
      //   path: paths.dashboard.permission,
      //   icon: ICONS.lock,
      //   allowedRoles: ['admin', 'manager'],
      //   caption: 'Only admin can see this item.',
      // },
      { title: 'Kênh học tập', path: paths.dashboard.channel.root, icon: <Iconify icon={'fluent-color:people-chat-24'} /> },
      { title: 'Trò chuyện', path: paths.dashboard.chat, icon: <Iconify icon={'fluent-color:chat-multiple-24'} /> },
      { title: 'Học trực tuyến', path: paths.dashboard.course.root, icon: <Iconify icon={'fluent-color:layer-diagonal-person-24'} /> },
    ],
  },
  {
    subheader: 'Cài đặt',
    items: [
      {
        title: 'Người dùng',
        path: paths.dashboard.user.root,
        icon: <Iconify icon={'fluent-color:people-list-20'} />,
        // children: [
        //   { title: 'Profile', path: paths.dashboard.user.root },
        //   { title: 'Cards', path: paths.dashboard.user.cards },
        //   { title: 'List', path: paths.dashboard.user.list },
        //   { title: 'Create', path: paths.dashboard.user.new },
        //   { title: 'Edit', path: paths.dashboard.user.demo.edit },
        //   { title: 'Account', path: paths.dashboard.user.account },
        // ],
      },
    ]
  }
];
