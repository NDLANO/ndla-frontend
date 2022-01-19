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
import { ApolloProvider } from '@apollo/client';
import { MissingRouterContext } from '@ndla/safelink';
import { useTranslation } from 'react-i18next';
import { createApolloClient } from '../util/apiHelpers';
import { BaseNameProvider } from '../components/BaseNameContext';
import { initializeI18n } from '../i18n';

const IframePageWrapper = ({ basename, locale, children, resCookie }) => {
  const { i18n } = useTranslation();
  i18n.language = locale;
  const client = createApolloClient(i18n.language, resCookie);
  initializeI18n(i18n, client);
  return (
    <ApolloProvider client={client}>
      <MissingRouterContext.Provider value={true}>
        <BaseNameProvider value={basename}>
          <PageContainer>
            <Helmet htmlAttributes={{ lang: locale }} />
            {children}
          </PageContainer>
        </BaseNameProvider>
      </MissingRouterContext.Provider>
    </ApolloProvider>
  );
};

IframePageWrapper.propTypes = {
  basename: PropTypes.string,
  locale: PropTypes.string.isRequired,
  resCookie: PropTypes.string,
};

export default IframePageWrapper;
