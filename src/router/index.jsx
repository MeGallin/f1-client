/**
 * F1 App Router Configuration
 *
 * Implements React Router with lazy loading, Suspense boundaries,
 * and error boundaries following best practices for performance
 * and user experience.
 */

import React, { Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBoundary from '../components/ErrorBoundary';
import Navigation from '../components/Navigation';

// Lazy load pages for code splitting and performance
const HomePage = React.lazy(() => import('../pages/Home'));
const HistoryPage = React.lazy(() => import('../pages/History'));

/**
 * Root Layout Component
 * Provides consistent layout with navigation and error boundaries
 */
const RootLayout = () => {
  return (
    <div className="app-layout">
      <Navigation />
      <ErrorBoundary>
        <main className="main-content">
          <Suspense fallback={<LoadingIndicator message="Loading page..." />}>
            <Outlet />
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
};

/**
 * Router Configuration
 * Defines all application routes with lazy loading
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <div className="error-page">
        <h1>Something went wrong!</h1>
        <p>Please try refreshing the page.</p>
      </div>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'history/:season',
        element: <HistoryPage />,
      },
      {
        path: 'history/:season/:round',
        element: <HistoryPage />,
      },
    ],
  },
]);

export default router;
