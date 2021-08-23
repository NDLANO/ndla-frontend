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
import { BasenameContext } from '../App';
import { initializeI18n } from '../i18n2';

const IframePageWrapper = ({
  basename,
  locale: { abbreviation: locale },
  children,
}) => {
  const { i18n } = useTranslation();
  i18n.language = locale;
  const client = createApolloClient(i18n.language);
  initializeI18n(i18n, client);
  return (
    <ApolloProvider client={client}>
      <MissingRouterContext.Provider value={true}>
        <BasenameContext.Provider value={basename}>
          <PageContainer>
            <Helmet htmlAttributes={{ lang: locale }} />
            {children}
          </PageContainer>
        </BasenameContext.Provider>
      </MissingRouterContext.Provider>
    </ApolloProvider>
  );
};

IframePageWrapper.propTypes = {
  basename: PropTypes.string,
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
};

export default IframePageWrapper;
