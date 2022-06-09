/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import { initializeFeideLogin } from '../../util/authHelpers';
import { toHome, toLoginFailure } from '../../util/routeHelpers';

export const LoginProviders = () => {
  const { authenticated, authContextLoaded } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (authenticated && authContextLoaded) {
      navigate(toHome());
    } else if (authContextLoaded && !authenticated) {
      initializeFeideLogin().catch(() => navigate(toLoginFailure()));
    }
  }, [authenticated, navigate, authContextLoaded]);

  return null;
};

export default LoginProviders;
