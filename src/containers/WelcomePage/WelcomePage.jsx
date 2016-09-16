/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { OneColumn } from '../../components';
import { toSearch } from '../../routes';

const messages = {
  search: { id: 'WelcomePage.search' },
  helloworld: { id: 'WelcomePage.helloworld' },
};

export const WelcomePage = ({ intl: { formatMessage: t } }) =>
  <OneColumn cssModifier="narrow">
    <FormattedMessage {...messages.helloworld}>
      {(m) => <h1>{m}</h1>}
    </FormattedMessage>
    <ul>
      <li>
        <Link to={toSearch()}>
          {t(messages.search)}
        </Link>
      </li>
    </ul>
  </OneColumn>
;

WelcomePage.propTypes = {
  intl: intlShape,
};

export default injectIntl(WelcomePage);
