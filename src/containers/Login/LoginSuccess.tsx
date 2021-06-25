/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { AuthContext } from '../../components/AuthenticationContext';
import { finalizeFeideLogin } from '../../util/authHelpers';
import { toHome } from '../../util/routeHelpers';

interface Props {
  location: {
    search: RouteComponentProps['location']['search'];
  };
  history: RouteComponentProps['history'];
}

export const LoginSuccess = ({ location: { search }, history }: Props) => {
  const { login, authenticated, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authenticated && authContextLoaded) {
      const searchParams = search.split('&');
      const feideLoginCode =
        searchParams.find(data => data.includes('code'))?.split('=')[1] || '';
      finalizeFeideLogin(feideLoginCode).then(() => {
        login();
        const params = queryString.parse(search);

        if (params.state !== null || params.state !== undefined) {
          history.push(params.state);
        } else {
          history.push(toHome());
        }
      });
    }
  }, [history, login, search, authenticated, authContextLoaded]);

  return <></>;
};

export default withRouter(LoginSuccess);
