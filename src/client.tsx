/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloClient, ApolloProvider } from '@apollo/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';
// @ts-ignore
import ErrorReporter from '@ndla/error-reporter';
// @ts-ignore
import { configureTracker } from '@ndla/tracker';
import { i18nInstance } from '@ndla/ui';
// @ts-ignore
import queryString from 'query-string';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  I18nextProvider,
  Trans,
  useTranslation,
  WithTranslation,
  withTranslation,
} from 'react-i18next';
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Router,
  Switch,
  useHistory,
} from 'react-router-dom';
import App from './App';
import { STORED_LANGUAGE_KEY } from './constants';
import ErrorBoundary from './containers/ErrorPage/ErrorBoundary';
import { createHistory } from './history';
import { getLocaleInfoFromPath } from './i18n';
import { InitialProps, LocaleType, NDLAWindow } from './interfaces';
import NewHistory from './NewHistory';
import routesFunc from './routes';
import './style/index.css';
// @ts-ignore
import { createApolloClient } from './util/apiHelpers';

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { initialProps, config, serverPath, serverQuery },
} = window;

const { abbreviation, basename, basepath } = getLocaleInfoFromPath(
  serverPath ?? '',
);

const serverQueryString = decodeURIComponent(
  queryString.stringify(serverQuery),
);
const locationFromServer = {
  pathname: basepath || '/',
  search: serverQueryString ? `?${serverQueryString}` : '',
};
// if (
//   basename === '' &&
//   storedLanguage !== null &&
//   isValidLocale(storedLanguage) &&
//   storedLanguage !== 'nb'
// ) {
//   const { pathname, search } = window.location;
// } else if (
//   storedLanguage !== basename &&
//   basename !== undefined &&
//   isValidLocale(basename)
// ) {
//   window.localStorage.setItem(STORED_LANGUAGE_KEY, basename);
// }

const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY);
if (!storedLanguage && basename) {
  window.localStorage.setItem(STORED_LANGUAGE_KEY, basename);
} else if (basename && storedLanguage && storedLanguage !== basename) {
  window.localStorage.setItem(STORED_LANGUAGE_KEY, basename);
} else {
  window.localStorage.setItem(STORED_LANGUAGE_KEY, 'nb');
}

const browserHistory = createHistory();

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey: config.logglyApiKey,
  environment: config.ndlaEnvironment,
  componentName: config.componentName,
  ignoreUrls: [/https:\/\/.*hotjar\.com.*/],
});

window.hasHydrated = false;
const renderOrHydrate = config.disableSSR ? ReactDOM.render : ReactDOM.hydrate;

const client = createApolloClient(abbreviation);
const cache = createCache();

// Use memory router if running under google translate
const testLocation = locationFromServer?.pathname + locationFromServer?.search;
const isGoogleUrl =
  decodeURIComponent(window.location.search).indexOf(testLocation) > -1;

interface RCProps {
  children?: React.ReactNode;
}

configureTracker({
  listen: browserHistory.listen,
  gaTrackingId: window.location.host ? config?.gaTrackingId : '',
  googleTagManagerId: config?.googleTagManagerId,
});

const RouterComponent = ({ children }: RCProps) =>
  isGoogleUrl ? (
    <MemoryRouter initialEntries={[locationFromServer]}>
      {children}
    </MemoryRouter>
  ) : (
    <Router history={browserHistory}>
      <Switch>
        <Route path="/:locale?" render={() => children} />
      </Switch>
    </Router>
  );

renderOrHydrate(
  <ApolloProvider client={client}>
    <CacheProvider value={cache}>
      {/* @ts-ignore */}
      {/* <I18nextProvider i18n={i18nInstance}>
        <TestComp />
      </I18nextProvider> */}
      <RouterComponent>
        {routesFunc({ ...initialProps, basename }, abbreviation, client, true)}
      </RouterComponent>
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
