/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import queryString from 'query-string';
import {RouteComponentProps} from 'react-router-dom';
import {
  personalAuthLogout
} from '../../util/authHelpers';

interface Props extends RouteComponentProps  {}

const LogoutSession = ( { location }: Props )  => {

  useEffect(() => {
    const query = queryString.parse(location.search);
    personalAuthLogout(query && query.returnToLogin);
  }, [])

  return <div/>;
}

export default LogoutSession;
