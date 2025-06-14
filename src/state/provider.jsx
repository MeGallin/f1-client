/**
 * Jotai Provider for F1 Application
 *
 * This component provides the Jotai store context to the entire application
 * and handles initial data loading.
 */

import React, { useEffect } from 'react';
import { Provider, useSetAtom } from 'jotai';
import { initializeAppAtom } from './actions';

/**
 * Application initializer component
 * This runs inside the Jotai provider to initialize the app state
 */
const AppInitializer = ({ children }) => {
  const initializeApp = useSetAtom(initializeAppAtom);

  useEffect(() => {
    const initializeWithRetry = async (retries = 3) => {
      try {
        await initializeApp();
      } catch (error) {
        console.error('Failed to initialize F1 app:', error);

        if (
          retries > 0 &&
          (error.response?.status === 429 || !error.response)
        ) {
          console.log(
            `Retrying initialization in 2 seconds... (${retries} retries left)`,
          );
          setTimeout(() => {
            initializeWithRetry(retries - 1);
          }, 2000);
        } else {
          console.error('App initialization failed permanently');
        }
      }
    };

    initializeWithRetry();
  }, [initializeApp]);

  return children;
};

/**
 * F1 State Provider Component
 * Wraps the application with Jotai Provider and initializes the state
 */
export const F1StateProvider = ({ children }) => {
  return (
    <Provider>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
};

export default F1StateProvider;
