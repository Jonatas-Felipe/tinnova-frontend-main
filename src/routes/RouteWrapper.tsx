import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/Auth';

import Auth from '~/pages/_Layouts/Auth';
import Default from '~/pages/_Layouts/Default';

interface Props {
  isPrivate?: boolean;
  both?: boolean;
  element: React.ReactNode;
}

const RouteWrapper: React.FC<Props> = ({
  isPrivate = false,
  both = false,
  element,
}) => {
  const { user } = useAuth();
  const isAuthenticated = useMemo(() => !!user, [user]);
  const location = useLocation();

  const Layout = useMemo(() => {
    if (both) {
      return isAuthenticated ? Default : Auth;
    }
    return isPrivate ? Default : Auth;
  }, [both, isPrivate, isAuthenticated]);

  if (!both && isPrivate !== isAuthenticated) {
    return (
      <Navigate
        to={isPrivate ? '/' : '/usuarios'}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Layout>{element}</Layout>;
};

export default RouteWrapper;
