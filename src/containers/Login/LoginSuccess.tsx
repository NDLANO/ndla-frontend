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
  const { login, authenticated, authContextLoaded } = useContext(AuthContext);
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated && authContextLoaded) {
      const searchParams = search.split('&');
      const feideLoginCode =
        searchParams.find(data => data.includes('code'))?.split('=')[1] || '';
      finalizeFeideLogin(feideLoginCode)
        .then(() => {
          login();
          const params = queryString.parse(search);
          // The cookie isn't set when loading the page initially so we trigger a reload
          window.location = params.state || toHome();
        })
        .catch(() => navigate(toLoginFailure()));
    }
  }, [navigate, login, search, authenticated, authContextLoaded]);

  return <></>;
};

export default LoginSuccess;
