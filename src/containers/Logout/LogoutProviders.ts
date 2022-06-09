/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useContext } from 'react';
import { AuthContext } from '../../components/AuthenticationContext';
import { feideLogout } from '../../util/authHelpers';

const LogoutProviders = () => {
  const { authenticated, logout, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated && authContextLoaded) {
      feideLogout(logout);
    }
  }, [authenticated, authContextLoaded, logout]);
  return null;
};

export default LogoutProviders;
