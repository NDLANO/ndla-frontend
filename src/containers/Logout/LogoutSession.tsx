/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import { feideLogout } from '../../util/authHelpers';
import { toHome } from '../../util/routeHelpers';

interface Props {
  history: RouteComponentProps['history'];
}

const LogoutSession = ({ history }: Props) => {
  const { authenticated, logout, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authenticated && authContextLoaded) {
      history.push(toHome());
    } else if (authenticated && authContextLoaded) {
      feideLogout(logout);
    }
  }, [authContextLoaded, authenticated, history, logout]);

  return null;
};

export default LogoutSession;
