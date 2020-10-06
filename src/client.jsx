/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import ErrorReporter from '@ndla/error-reporter';
import IntlProvider from '@ndla/i18n';
import { ApolloProvider } from '@apollo/react-hooks';
import { setCookie, getCookie } from '@ndla/util';
import { configureTracker } from '@ndla/tracker';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';

import { createHistory } from './history';
import { getLocaleInfoFromPath, isValidLocale } from './i18n';
import { createApolloClient } from './util/apiHelpers';
import routes from './routes';
import './style/index.css';

const {
  DATA: { initialProps, config, serverPath, serverQuery },
} = window;
const { abbreviation, messages, basename } = getLocaleInfoFromPath(serverPath);

const fakeLocation = {
  pathname: serverPath,
  search: serverQuery,
};

const storedLanguage = getCookie('language', document.cookie);
if (
  basename === '' &&
  isValidLocale(storedLanguage) &&
  storedLanguage !== 'nb'
) {
  const { pathname, search } = window.location;
  window.location.href = `/${storedLanguage}${pathname}${search}`;
} else if (storedLanguage !== basename && isValidLocale(basename)) {
  setCookie('language', basename);
}

const browserHistory = createHistory(basename);

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
  ignoreUrls: [/https:\/\/.*hotjar\.com.*/],
});

configureTracker({
  listen: browserHistory.listen,
  gaTrackingId: window.location.host ? config.gaTrackingId : '',
  googleTagManagerId: config.googleTagManagerId,
});

window.hasHydrated = false;
const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;

const client = createApolloClient(abbreviation);
const cache = createCache();
renderOrHydrate(
  <ApolloProvider client={client}>
    <CacheProvider value={cache}>
      <IntlProvider locale={abbreviation} messages={messages}>
        <Router history={browserHistory}>
          {routes({ ...initialProps, basename }, abbreviation, fakeLocation)}
        </Router>
      </IntlProvider>
    </CacheProvider>
  </ApolloProvider>,
  document.getElementById('root'),
  () => {
    // See: /src/util/transformArticle.js for info on why this is needed.
    window.hasHydrated = true;
  },
);

if (module.hot) {
  module.hot.accept();
}
