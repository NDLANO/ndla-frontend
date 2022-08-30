/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import { feideLogout } from '../../util/authHelpers';
import { LocationState } from '../Login/LoginProviders';

const LogoutProviders = () => {
  const { authenticated, logout, authContextLoaded } = useContext(AuthContext);

  const location = useLocation();
  const locationState = location.state as LocationState;

  useEffect(() => {
    if (authenticated && authContextLoaded) {
      feideLogout(logout, locationState?.from);
    }
  }, [authenticated, authContextLoaded, logout, locationState?.from]);
  return null;
};

export default LogoutProviders;
