/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router';
import { OneColumn } from '../../components';
import polyglot from '../../i18n';
import { toSearch } from '../../routes';

export const Welcome = () =>
  <OneColumn cssModifier="narrow">
    <h1>{polyglot.t('welcome.helloworld')}</h1>
    <ul>
      <li>
        <Link to={toSearch()}>
          {polyglot.t('welcome.search')}
        </Link>
      </li>
    </ul>
  </OneColumn>
;

export default Welcome;
