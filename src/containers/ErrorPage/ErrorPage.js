/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Content, Masthead, MastheadItem, Logo } from 'ndla-ui';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import Page from '../Page/Page';
import ZendeskButton from '../../components/ZendeskButton';

const ErrorPage = ({ locale }) => (
  <Page locale={locale}>
    <Content>
      <Masthead fixed>
        <MastheadItem right>
          <Logo to="/" label="Nasjonal digital læringsarena" />
        </MastheadItem>
      </Masthead>
      <DefaultErrorMessage />
    </Content>
    <ZendeskButton />
  </Page>
);

ErrorPage.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default ErrorPage;
