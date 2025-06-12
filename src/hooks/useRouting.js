/**
 * Custom Routing Hooks
 *
 * Provides utility hooks for navigation, route management, and state synchronization
 */

import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * Enhanced navigation hook with F1-specific routing logic
 */
export const useF1Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const goToHistory = useCallback(
    (season = null, round = null) => {
      if (season && round) {
        navigate(`/history/${season}/${round}`);
      } else if (season) {
        navigate(`/history/${season}`);
      } else {
        navigate('/history');
      }
    },
    [navigate],
  );

  const goToSeason = useCallback(
    (season) => {
      navigate(`/history/${season}`);
    },
    [navigate],
  );

  const goToRace = useCallback(
    (season, round) => {
      navigate(`/history/${season}/${round}`);
    },
    [navigate],
  );

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const goForward = useCallback(() => {
    window.history.forward();
  }, []);

  const refreshRoute = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    navigate,
    location,
    goToHome,
    goToHistory,
    goToSeason,
    goToRace,
    goBack,
    goForward,
    refreshRoute,
    currentPath: location.pathname,
    isHome: location.pathname === '/',
    isHistory: location.pathname.startsWith('/history'),
  };
};

/**
 * Route parameters hook for F1 specific params
 */
export const useF1RouteParams = () => {
  const params = useParams();
  const location = useLocation();

  const season = params.season ? parseInt(params.season) : null;
  const round = params.round ? parseInt(params.round) : null;

  const isValidSeason =
    season && season >= 1950 && season <= new Date().getFullYear();
  const isValidRound = round && round >= 1 && round <= 25; // Max 25 races per season

  return {
    season,
    round,
    isValidSeason,
    isValidRound,
    rawParams: params,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
};

/**
 * Route history and breadcrumb management
 */
export const useRouteBreadcrumb = () => {
  const location = useLocation();
  const params = useParams();

  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Home', path: '/', icon: 'fas fa-home' }];

    const pathSegments = location.pathname.split('/').filter(Boolean);

    if (pathSegments[0] === 'history') {
      crumbs.push({
        label: 'History',
        path: '/history',
        icon: 'fas fa-history',
      });

      if (params.season) {
        crumbs.push({
          label: `${params.season} Season`,
          path: `/history/${params.season}`,
          icon: 'fas fa-calendar',
        });

        if (params.round) {
          crumbs.push({
            label: `Round ${params.round}`,
            path: `/history/${params.season}/${params.round}`,
            icon: 'fas fa-flag-checkered',
          });
        }
      }
    }

    return crumbs;
  }, [location.pathname, params]);

  return {
    breadcrumbs,
    currentPage: breadcrumbs[breadcrumbs.length - 1],
    parentPage:
      breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null,
  };
};

/**
 * Route-based state synchronization
 */
export const useRouteSync = (setSelectedYear) => {
  const { season } = useF1RouteParams();
  const location = useLocation();

  // Sync selected year with route params
  const syncStateWithRoute = useCallback(() => {
    if (season && setSelectedYear) {
      setSelectedYear(season);
    }
  }, [season, setSelectedYear]);

  // Determine current section based on route
  const currentSection = useMemo(() => {
    if (location.pathname === '/') return 'home';
    if (location.pathname.startsWith('/history')) return 'history';
    return 'unknown';
  }, [location.pathname]);

  return {
    syncStateWithRoute,
    currentSection,
    shouldSyncYear: !!season,
  };
};

/**
 * Route transitions and animations
 */
export const useRouteTransition = () => {
  const location = useLocation();

  const getTransitionClass = useCallback((fromPath, toPath) => {
    // Define transition classes based on route changes
    if (fromPath === '/' && toPath.startsWith('/history')) {
      return 'slide-left';
    }
    if (fromPath.startsWith('/history') && toPath === '/') {
      return 'slide-right';
    }
    if (fromPath.includes('/history/') && toPath === '/history') {
      return 'slide-up';
    }
    return 'fade';
  }, []);

  return {
    currentLocation: location,
    getTransitionClass,
  };
};

/**
 * Route validation and error handling
 */
export const useRouteValidation = () => {
  const { season, round, isValidSeason, isValidRound } = useF1RouteParams();
  const location = useLocation();

  const routeErrors = useMemo(() => {
    const errors = [];

    if (season && !isValidSeason) {
      errors.push({
        type: 'invalid_season',
        message: `Invalid season: ${season}. Season must be between 1950 and ${new Date().getFullYear()}.`,
        suggestion: `Try /history/${new Date().getFullYear()}`,
      });
    }

    if (round && !isValidRound) {
      errors.push({
        type: 'invalid_round',
        message: `Invalid round: ${round}. Round must be between 1 and 25.`,
        suggestion: season ? `/history/${season}` : '/history',
      });
    }

    return errors;
  }, [season, round, isValidSeason, isValidRound]);

  const hasRouteErrors = routeErrors.length > 0;

  return {
    routeErrors,
    hasRouteErrors,
    isValidRoute: !hasRouteErrors,
    currentRoute: location.pathname,
  };
};

/**
 * URL query parameters management
 */
export const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const getParam = useCallback(
    (key) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const setParam = useCallback(
    (key, value) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (value === null || value === undefined || value === '') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }

      const newSearch = newSearchParams.toString();
      navigate(
        {
          pathname: location.pathname,
          search: newSearch ? `?${newSearch}` : '',
        },
        { replace: true },
      );
    },
    [searchParams, navigate, location.pathname],
  );

  const removeParam = useCallback(
    (key) => {
      setParam(key, null);
    },
    [setParam],
  );

  const getAllParams = useCallback(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  return {
    getParam,
    setParam,
    removeParam,
    getAllParams,
    hasParams: searchParams.toString().length > 0,
  };
};
