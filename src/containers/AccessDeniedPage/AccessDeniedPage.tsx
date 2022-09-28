/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { OneColumn, ErrorResourceAccessDenied } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Status } from '../../components';
import { AuthContext } from '../../components/AuthenticationContext';
import { toHref } from '../../util/urlHelper';

const AccessDenied = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { authenticated } = useContext(AuthContext);
  const statusCode = authenticated ? 403 : 401;

  return (
    <Status code={statusCode}>
      <HelmetWithTracker title={t('htmlTitles.accessDenied')} />
      <OneColumn cssModifier="clear">
        <ErrorResourceAccessDenied
          onAuthenticateClick={() => {
            const route = authenticated ? 'logout' : 'login';
            window.location.href = `/${route}?state=${toHref(location)}`;
          }}
        />
      </OneColumn>
    </Status>
  );
};

AccessDenied.propTypes = {};

export default AccessDenied;
