/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-unfetch';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import ErrorReporter from '@ndla/error-reporter';
import { MissingRouterContext } from '@ndla/safelink';
import { i18nInstance } from '@ndla/ui';
import { ApolloProvider } from '@apollo/client';
import '@fontsource/source-sans-pro/index.css';
import '@fontsource/source-sans-pro/400-italic.css';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/300-italic.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/source-sans-pro/700.css';
import '@fontsource/source-code-pro/index.css';
import '@fontsource/source-code-pro/400-italic.css';
import '@fontsource/source-code-pro/700.css';
import '@fontsource/source-serif-pro/index.css';
import '@fontsource/source-serif-pro/400-italic.css';
import '@fontsource/source-serif-pro/700.css';
import { getCookie } from '@ndla/util';
import { createApolloClient } from '../util/apiHelpers';
import LtiProvider from './LtiProvider';
import '../style/index.css';
import { STORED_LANGUAGE_COOKIE_KEY } from '../constants';
import { initializeI18n, isValidLocale } from '../i18n';

const {
  DATA: { initialProps, config },
} = window;

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
  ignoreUrls: [],
});

const storedLanguage = getCookie(STORED_LANGUAGE_COOKIE_KEY, document.cookie);
const language = isValidLocale(storedLanguage)
  ? storedLanguage
  : config.defaultLocale;
const client = createApolloClient(language);
const i18n = initializeI18n(i18nInstance, language);

const root = createRoot(document.getElementById('root')!);
root.render(
  <HelmetProvider>
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={client}>
        <MissingRouterContext.Provider value={true}>
          <LtiProvider {...initialProps} />
        </MissingRouterContext.Provider>
      </ApolloProvider>
    </I18nextProvider>
  </HelmetProvider>,
);

if (module.hot) {
  module.hot.accept();
}
