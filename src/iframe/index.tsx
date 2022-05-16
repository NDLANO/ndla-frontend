/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloProvider } from '@apollo/client';
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
import '@fontsource/shadows-into-light-two/index.css';
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

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;
renderOrHydrate(
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
  </HelmetProvider>,
  document.getElementById('root'),
  () => {
    window.hasHydrated = true;
  },
);

if (module.hot) {
  module.hot.accept();
}
