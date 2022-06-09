/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { AuthContext } from '../../components/AuthenticationContext';
import { feideLogout } from '../../util/authHelpers';
import { toHome } from '../../util/routeHelpers';

const LogoutSession = () => {
  const { authenticated, logout, authContextLoaded } = useContext(AuthContext);
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    if (!authenticated && authContextLoaded) {
      const params = queryString.parse(search);
      navigate(params.state || toHome());
    } else if (authenticated && authContextLoaded) {
      feideLogout(logout);
    }
  }, [authenticated, authContextLoaded, navigate, logout, search]);

  return null;
};

export default LogoutSession;
