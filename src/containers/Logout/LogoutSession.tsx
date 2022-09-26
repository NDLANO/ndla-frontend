/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useContext } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import RedirectContext from '../../components/RedirectContext';
import { privateRoutes } from '../../routes';
import { feideLogout } from '../../util/authHelpers';
import { toHome } from '../../util/routeHelpers';

const LogoutSession = () => {
  const { authenticated, logout, authContextLoaded } = useContext(AuthContext);
  const redirect = useContext(RedirectContext);
  const { search } = useLocation();
  const params = queryString.parse(search) ?? '';
  const lastPath = params.state;
  if (!authenticated) {
    const wasPrivateRoute =
      lastPath && privateRoutes.some(route => matchPath(route, lastPath));

    if (redirect) {
      redirect.status = 303;
      redirect.url = wasPrivateRoute ? toHome() : lastPath ?? toHome();
    }
  } else if (authenticated && authContextLoaded) {
    feideLogout(logout, lastPath);
  }

  return null;
};

export default LogoutSession;
