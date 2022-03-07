/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';

import { Helmet } from 'react-helmet';
import { PageContainer } from '@ndla/ui';
import { useApolloClient } from '@apollo/client';
import { MissingRouterContext } from '@ndla/safelink';
import { useTranslation } from 'react-i18next';
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
}: Props) => {
  const { i18n } = useTranslation();
  if (locale) {
    i18n.language = locale;
  }
  const client = useApolloClient();
  const basename = isValidLocale(basenameProp) ? basenameProp : '';
  initializeI18n(i18n, client);
  return (
    <MissingRouterContext.Provider value={true}>
      <BaseNameProvider value={basename}>
        <PageContainer>
          <Helmet htmlAttributes={{ lang: locale }} />
          {children}
        </PageContainer>
      </BaseNameProvider>
    </MissingRouterContext.Provider>
  );
};

export default IframePageWrapper;
