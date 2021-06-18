/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
//import { toLogoutSession } from '../../util/routeHelpers'; Possible edit for both login and logout

interface Props extends RouteComponentProps {}

const LogoutProviders = ({ history }: Props) => {
  useEffect(() => {
    history.push('/logout/session');
  });
  return null;
};

export default LogoutProviders;
