import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import Garde from './pages/Garde';
import AffectMembers from './pages/AffectMembers';
import CreatePlanning from './pages/CreatePlanning';
import PlanningManager from './pages/PlanningManager';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: '/Garde',
            Component: Garde,
          },
          {
            path: '/AffectMembers',
            Component: AffectMembers,
          },
          {
            path: '/CreatePlanning',
            Component: CreatePlanning,
          },
          {
            path: '/PlanningManager',
            Component: PlanningManager,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);