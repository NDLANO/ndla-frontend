/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toLogin } from '../../util/routeHelpers';

export const LoginFailure = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('loginFailure.errorMessage')}</h2>
      <p>
        <Link to={toLogin()}>{t('loginFailure.loginLink')}</Link>
      </p>
    </div>
  );
};

export default LoginFailure;
