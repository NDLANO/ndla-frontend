/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, MemoryRouter } from 'react-router-dom';
import ErrorReporter from '@ndla/error-reporter';
import IntlProvider from '@ndla/i18n';
import { ApolloProvider } from '@apollo/client';
import { configureTracker } from '@ndla/tracker';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';

import queryString from 'query-string';
import { createHistory } from './history';
import { getLocaleInfoFromPath, isValidLocale } from './i18n';
import { createApolloClient } from './util/apiHelpers';
import routes from './routes';
import { STORED_LANGUAGE_KEY } from './constants';
import './style/index.css';

const {
  DATA: { initialProps, config, serverPath, serverQuery },
} = window;
const { abbreviation, messages, basename, basepath } = getLocaleInfoFromPath(
  serverPath,
);

const serverQueryString = decodeURIComponent(
  queryString.stringify(serverQuery),
);
const locationFromServer = {
  pathname: basepath || '/',
  search: serverQueryString ? `?${serverQueryString}` : '',
};

const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY);
if (
  basename === '' &&
  isValidLocale(storedLanguage) &&
  storedLanguage !== 'nb'
) {
  const { pathname, search } = window.location;
  window.location.href = `/${storedLanguage}${pathname}${search}`;
} else if (storedLanguage !== basename && isValidLocale(basename)) {
  window.localStorage.setItem(STORED_LANGUAGE_KEY, basename);
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

// Use memory router if running under google translate
const testLocation = locationFromServer?.pathname + locationFromServer?.search;
const isGoogleUrl =
  decodeURIComponent(window.location.search).indexOf(testLocation) > -1;

const RouterComponent = ({ children }) =>
  isGoogleUrl ? (
    <MemoryRouter
      history={browserHistory}
      initialEntries={[locationFromServer]}>
      {children}
    </MemoryRouter>
  ) : (
    <Router history={browserHistory}>{children}</Router>
  );

renderOrHydrate(
  <ApolloProvider client={client}>
    <CacheProvider value={cache}>
      <IntlProvider locale={abbreviation} messages={messages}>
        <RouterComponent>
          {routes({ ...initialProps, basename }, abbreviation)}
        </RouterComponent>
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
