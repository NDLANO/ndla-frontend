/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { initializeFeideLogin } from '../../util/authHelpers';

interface Props extends RouteComponentProps {
  authenticated: boolean;
  authContextLoaded: boolean;
}

export const LoginProviders = ({
  authenticated,
  history,
  authContextLoaded,
}: Props) => {
  useEffect(() => {
    if (authenticated && authContextLoaded) {
      history.push('/');
    } else if (authContextLoaded && !authenticated) {
      initializeFeideLogin();
    }
  }, [authenticated, history, authContextLoaded]);

  return null;
};

export default LoginProviders;
