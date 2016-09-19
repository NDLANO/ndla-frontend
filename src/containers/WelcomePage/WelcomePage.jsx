/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router';
import { injectT } from '../../i18n';
import { OneColumn } from '../../components';
import { toSearch } from '../../routes';

export const WelcomePage = ({ t }) =>
  <OneColumn cssModifier="narrow">
    <h1>{t('WelcomePage.helloworld')}</h1>
    <ul>
      <li>
        <Link to={toSearch()}>
          {t('WelcomePage.search')}
        </Link>
      </li>
    </ul>
  </OneColumn>
;

WelcomePage.propTypes = {
};

export default injectT(WelcomePage);
