/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AuthContext } from '../../components/AuthenticationContext';
import React, { useContext, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  setTokenSetInLocalStorage,
  getPKCECode,
  locationOrigin,
} from '../../util/authHelpers';

interface Props extends RouteComponentProps {} // Definert i LoginProviders, LogoutProviders, LogoutSession og loginFailure

export const LoginSuccess = ({ location: { search } }: Props) => {
  //@ts-ignore
  const { login } = useContext(AuthContext);
  

  useEffect(() => {
    
    const searchParams = search.substring(1).split('&');
    const code =
      searchParams.find(data => data.match('code'))?.split('=')[1] || '';
    const verifier = getPKCECode();

    fetch(`${locationOrigin}/feide/token?code=${code}&verifier=${verifier}`)
      .then(json => json.json())
      .then(token => setTokenSetInLocalStorage(token, true))
      .then(() => (window.location.href = '/'));
  }, []);

  return <div />;
};

export default withRouter(LoginSuccess);
