import { PartialRouteObject } from 'react-router';

import Authenticated from 'src/components/Authenticated';
import { Navigate } from 'react-router-dom';

import BaseLayout from 'src/layouts/BaseLayout';
import AccentSidebarLayout from 'src/layouts/AccentSidebarLayout';

import dashboardsRoutes from './dashboards';
import accountRoutes from './account';
import baseRoutes from './base';

const router: PartialRouteObject[] = [
  {
    path: 'account',
    children: accountRoutes
  },
  {
    path: '*',
    element: <BaseLayout />,
    children: baseRoutes
  },
  // Accent Sidebar Layout

  {
    path: '/',
    element: (
      <Authenticated>
        <AccentSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      }
    ]
  }
];

export default router;
