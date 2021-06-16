/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { loginPersonalAccessToken } from '../../util/authHelpers';

interface Props {
  authenticated: boolean | undefined
}

export const LoginProviders = ({authenticated}: Props) => {
  // @ts-ignore
  
  
  useEffect(() => {
    if(!authenticated){
      console.log(authenticated);
      loginPersonalAccessToken();
    }
  }, []);
  return null;
};

export default LoginProviders;
