/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useContext, useEffect } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import { privateRoutes } from '../../routes';
import { feideLogout } from '../../util/authHelpers';
import { toHome } from '../../util/routeHelpers';
import { LocationState } from '../Login/LoginProviders';

const LogoutSession = () => {
  const { authenticated, logout, authContextLoaded } = useContext(AuthContext);
  const navigate = useNavigate();
  const { search, state } = useLocation();
  const from = (state as LocationState)?.from;

  useEffect(() => {
    if (!authenticated && authContextLoaded) {
      const params = queryString.parse(search);

      const lastPath = params.state;
      const wasPrivateRoute = privateRoutes.some(route =>
        matchPath(route, lastPath),
      );

      navigate(wasPrivateRoute ? toHome() : lastPath ?? toHome());
    } else if (authenticated && authContextLoaded) {
      feideLogout(logout, from);
    }
  }, [authenticated, authContextLoaded, navigate, logout, search, from]);

  return null;
};

export default LogoutSession;
