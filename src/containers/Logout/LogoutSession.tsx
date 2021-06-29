/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { AuthContext } from '../../components/AuthenticationContext';
import { feideLogout } from '../../util/authHelpers';
import { toHome } from '../../util/routeHelpers';

interface Props {
  history: RouteComponentProps['history'];
  location: {
    search: RouteComponentProps['location']['search'];
  };
}

const LogoutSession = ({ history, location: { search } }: Props) => {
  const { authenticated, logout, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authenticated && authContextLoaded) {
      const params = queryString.parse(search);
      history.push(params.state || toHome());
    } else if (authenticated && authContextLoaded) {
      feideLogout(logout);
    }
  }, [authenticated, authContextLoaded, history, logout, search]);

  return null;
};

export default LogoutSession;
