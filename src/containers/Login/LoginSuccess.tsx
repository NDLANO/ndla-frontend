/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import { finalizeFeideLogin } from '../../util/authHelpers';

interface Props extends RouteComponentProps {} // Definert i LoginProviders, LogoutProviders, LogoutSession og loginFailure

export const LoginSuccess = ({ location: { search }, history }: Props) => {
  //@ts-ignore
  const { login, authenticated, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authenticated && authContextLoaded) {
      const searchParams = search.substring(1).split('&');
      const feideLoginCode =
        searchParams.find(data => data.match('code'))?.split('=')[1] || '';
      finalizeFeideLogin(feideLoginCode).then(() => {
        login();
        history.push('/');
      });
    }
  }, [history, login, search, authenticated, authContextLoaded]);

  return <div />;
};

export default withRouter(LoginSuccess);
