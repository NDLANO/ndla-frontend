/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloProvider } from '@apollo/client';
import { i18nInstance } from '@ndla/ui';
import { configureTracker } from '@ndla/tracker';
import ErrorReporter from '@ndla/error-reporter';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { Router } from 'react-router';
import IframePageContainer from './IframePageContainer';
import { createHistory } from '../history';
import { EmotionCacheKey } from '../constants';
import { createApolloClient } from '../util/apiHelpers';
import { initializeI18n } from '../i18n';

const { config, initialProps } = window.DATA;

const {
  disableSSR,
  logglyApiKey,
  logEnvironment: environment,
  componentName,
} = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
});

configureTracker({
  listen: _ => {
    return () => {};
  },
  gaTrackingId: config.gaTrackingId,
  googleTagManagerId: config.googleTagManagerId,
});

const browserHistory = createHistory();
const cache = createCache({ key: EmotionCacheKey });

const client = createApolloClient(initialProps.locale, initialProps.resCookie);

const i18n = initializeI18n(
  i18nInstance,
  initialProps.locale ?? config.defaultLocale,
);

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;
renderOrHydrate(
  <I18nextProvider i18n={i18n}>
    <HelmetProvider>
      <ApolloProvider client={client}>
        <CacheProvider value={cache}>
          <Router history={browserHistory}>
            <CompatRouter>
              <IframePageContainer {...initialProps} />
            </CompatRouter>
          </Router>
        </CacheProvider>
      </ApolloProvider>
    </HelmetProvider>
  </I18nextProvider>,
  document.getElementById('root'),
  () => {
    window.hasHydrated = true;
  },
);

if (module.hot) {
  module.hot.accept();
}
