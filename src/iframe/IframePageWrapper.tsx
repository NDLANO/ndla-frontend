/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode } from 'react';

import { Helmet } from 'react-helmet';
import { PageContainer } from '@ndla/ui';
import { ApolloProvider } from '@apollo/client';
import { MissingRouterContext } from '@ndla/safelink';
import { useTranslation } from 'react-i18next';
import { createApolloClient } from '../util/apiHelpers';
import { BaseNameProvider } from '../components/BaseNameContext';
import { initializeI18n, isValidLocale } from '../i18n';
import { LocaleType } from '../interfaces';

interface Props {
  basename?: string;
  locale?: LocaleType;
  resCookie?: string;
  children: ReactNode;
}
const IframePageWrapper = ({
  basename: basenameProp,
  locale,
  children,
  resCookie,
}: Props) => {
  const { i18n } = useTranslation();
  if (locale) {
    i18n.language = locale;
  }
  const basename = isValidLocale(basenameProp) ? basenameProp : '';
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

export default IframePageWrapper;
