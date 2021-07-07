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
// @ts-ignore
import ErrorReporter from '@ndla/error-reporter';
import IntlProvider from '@ndla/i18n';
import { ApolloProvider } from '@apollo/client';
// @ts-ignore
import { configureTracker } from '@ndla/tracker';

// @ts-ignore
import queryString from 'query-string';
import { createHistory } from './history';
import { getLocaleInfoFromPath, isValidLocale } from './i18n';
// @ts-ignore
import { createApolloClient } from './util/apiHelpers';
import { STORED_LANGUAGE_KEY } from './constants';
import routesFunc from './routes';
import './style/index.css';
import { NDLAWindow } from './interfaces';

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { initialProps, config, serverPath, serverQuery },
} = window;

const { abbreviation, messages, basename, basepath } = getLocaleInfoFromPath(
  serverPath ?? '',
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
  storedLanguage !== null &&
  isValidLocale(storedLanguage) &&
  storedLanguage !== 'nb'
) {
  const { pathname, search } = window.location;
  window.location.href = `/${storedLanguage}${pathname}${search}`;
} else if (
  storedLanguage !== basename &&
  basename !== undefined &&
  isValidLocale(basename)
) {
  window.localStorage.setItem(STORED_LANGUAGE_KEY, basename);
}

const browserHistory = createHistory(basename ?? '');

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey: config.logglyApiKey,
  environment: config.environment,
  componentName: config.componentName,
  ignoreUrls: [/https:\/\/.*hotjar\.com.*/],
});

configureTracker({
  listen: browserHistory.listen,
  gaTrackingId: window.location.host ? config?.gaTrackingId : '',
  googleTagManagerId: config?.googleTagManagerId,
});

window.hasHydrated = false;
const renderOrHydrate = config.disableSSR ? ReactDOM.render : ReactDOM.hydrate;

const client = createApolloClient(abbreviation);

// Use memory router if running under google translate
const testLocation = locationFromServer?.pathname + locationFromServer?.search;
const isGoogleUrl =
  decodeURIComponent(window.location.search).indexOf(testLocation) > -1;

interface RCProps {
  children?: React.ReactNode;
}

const RouterComponent = ({ children }: RCProps) =>
  isGoogleUrl ? (
    <MemoryRouter initialEntries={[locationFromServer]}>
      {children}
    </MemoryRouter>
  ) : (
    <Router history={browserHistory}>{children}</Router>
  );

renderOrHydrate(
  <ApolloProvider client={client}>
    <IntlProvider locale={abbreviation} messages={messages}>
      <RouterComponent>
        {routesFunc({ ...initialProps, basename }, abbreviation)}
      </RouterComponent>
    </IntlProvider>
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
