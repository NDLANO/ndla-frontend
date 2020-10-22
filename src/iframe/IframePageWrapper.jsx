/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';
import { PageContainer } from '@ndla/ui';
import IntlProvider from '@ndla/i18n';
import { ApolloProvider } from '@apollo/react-hooks';
import { MissingRouterContext } from '@ndla/safelink';
import { createApolloClient } from '../util/apiHelpers';
import { BasenameContext } from '../App';

const IframePageWrapper = ({
  basename,
  locale: { abbreviation: locale, messages },
  children,
}) => (
  <ApolloProvider client={createApolloClient(locale)}>
    <IntlProvider locale={locale} messages={messages}>
      <MissingRouterContext.Provider value={true}>
        <BasenameContext.Provider value={basename}>
          <PageContainer>
            <Helmet htmlAttributes={{ lang: locale }} />
            {children}
          </PageContainer>
        </BasenameContext.Provider>
      </MissingRouterContext.Provider>
    </IntlProvider>
  </ApolloProvider>
);

IframePageWrapper.propTypes = {
  basename: PropTypes.string,
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
};

export default IframePageWrapper;
