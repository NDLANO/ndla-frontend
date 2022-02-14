/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { configureTracker } from '@ndla/tracker';
import ErrorReporter from '@ndla/error-reporter';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import { Router } from 'react-router';
import IframePageContainer from './IframePageContainer';
import { createHistory } from '../history';
import { EmotionCacheKey } from '../constants';
import { createApolloClient } from '../util/apiHelpers';

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
  <ApolloProvider client={client}>
    <CacheProvider value={cache}>
      <Router history={browserHistory}>
        <IframePageContainer {...initialProps} />
      </Router>
    </CacheProvider>
  </ApolloProvider>,
  document.getElementById('root'),
  () => {
    window.hasHydrated = true;
  },
);

if (module.hot) {
  module.hot.accept();
}
