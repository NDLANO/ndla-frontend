/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import { initializeFeideLogin } from '../../util/authHelpers';
import { toHome, toLoginFailure } from '../../util/routeHelpers';

export type LocationState =
  | {
      from?: string;
    }
  | undefined;

export const LoginProviders = () => {
  const { authenticated, authContextLoaded, needsInteraction } = useContext(
    AuthContext,
  );
  const location = useLocation();
  const locationState = location.state as LocationState;
  const navigate = useNavigate();
  useEffect(() => {
    if (authenticated && authContextLoaded) {
      navigate(locationState?.from ?? toHome());
    } else if (authContextLoaded && !authenticated) {
      initializeFeideLogin(locationState?.from, needsInteraction).catch(() => {
        navigate(toLoginFailure());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, navigate, authContextLoaded]);

  return null;
};

export default LoginProviders;
