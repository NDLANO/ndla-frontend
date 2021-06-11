/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { loginPersonalAccessToken } from '../../util/authHelpers';

export const LoginProviders = () => {
  useEffect(() => {
    loginPersonalAccessToken();
  }, []);
  return null;
};

export default LoginProviders;
