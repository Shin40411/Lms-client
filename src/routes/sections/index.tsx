import { Navigate, type RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { DashboardLayout } from 'src/layouts/dashboard';

import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';
import { paths } from '../paths';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: (
      <Navigate
        to={paths.dashboard.root}
      />
    ),
  },

  // Auth
  ...authRoutes,
  ...authDemoRoutes,

  // Dashboard
  ...dashboardRoutes,

  // Main
  ...mainRoutes,

  // Components
  ...componentsRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
