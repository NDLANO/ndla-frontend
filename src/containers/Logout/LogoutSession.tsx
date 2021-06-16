/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext, useEffect } from 'react';
import queryString from 'query-string';
import {RouteComponentProps} from 'react-router-dom';
import {
  personalAuthLogout
} from '../../util/authHelpers';
import  {AuthContext} from '../../components/AuthenticationContext';

interface Props extends RouteComponentProps  {}

const LogoutSession = ( { location }: Props )  => {
  //@ts-ignore
  const { logout }  = useContext(AuthContext);

  useEffect(() => {
    const query = queryString.parse(location.search);
    logout();
    personalAuthLogout(query && query.returnToLogin);
  }, [])

  return <div/>;
}

export default LogoutSession;
