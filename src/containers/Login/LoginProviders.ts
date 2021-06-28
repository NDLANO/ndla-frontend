/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { initializeFeideLogin } from '../../util/authHelpers';
import { toHome, toLoginFailure } from '../../util/routeHelpers';

interface Props {
  authenticated: boolean;
  authContextLoaded: boolean;
  history: RouteComponentProps['history'];
}

export const LoginProviders = ({
  authenticated,
  history,
  authContextLoaded,
}: Props) => {
  useEffect(() => {
    if (authenticated && authContextLoaded) {
      history.push(toHome());
    } else if (authContextLoaded && !authenticated) {
      initializeFeideLogin().catch(() => history.push(toLoginFailure()));
    }
  }, [authenticated, history, authContextLoaded]);

  return null;
};

export default LoginProviders;
