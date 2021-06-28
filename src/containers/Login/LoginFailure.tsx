/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { injectT, tType } from '@ndla/i18n';
import { toLogin } from '../../util/routeHelpers';

export const LoginFailure = ({ t }: tType) => {
  return (
    <div>
      <h2>{t('loginFailure.errorMessage')}</h2>
      <p>
        <Link to={toLogin()} >{t('loginFailure.loginLink')}</Link>
      </p>
    </div>
  );
};

export default injectT(LoginFailure);
