/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import { OneColumn, ErrorResourceAccessDenied } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { Status } from '../../components';
import { AuthContext } from '../../components/AuthenticationContext';

const AccessDenied = () => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const statusCode = authenticated ? 403 : 401;

  return (
    <Status code={statusCode}>
      <HelmetWithTracker title={t('htmlTitles.accessDenied')} />
      <OneColumn cssModifier="clear">
        <ErrorResourceAccessDenied onAuthenticateClick={() => {}} />
      </OneColumn>
    </Status>
  );
};

AccessDenied.propTypes = {};

export default AccessDenied;
