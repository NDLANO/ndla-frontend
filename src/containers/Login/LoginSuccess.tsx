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
import { finalizeFeideLogin } from '../../util/authHelpers';
import { toHome, toLoginFailure } from '../../util/routeHelpers';

export const LoginSuccess = () => {
  const {
    login,
    authenticated,
    authContextLoaded,
    setNeedsInteraction,
  } = useContext(AuthContext);
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = queryString.parse(search);
    if (searchParams.error === 'interaction_required') {
      setNeedsInteraction(true);
      navigate('/login');
      return;
    }

    if (!authenticated && authContextLoaded) {
      const feideLoginCode = searchParams.code || '';
      finalizeFeideLogin(feideLoginCode)
        .then(() => {
          login();
          // The cookie isn't set when loading the page initially so we trigger a reload
          window.location = searchParams.state || toHome();
        })
        .catch(() => navigate(toLoginFailure()));
    }
  }, [
    navigate,
    login,
    setNeedsInteraction,
    search,
    authenticated,
    authContextLoaded,
  ]);
  return null;
};

export default LoginSuccess;
