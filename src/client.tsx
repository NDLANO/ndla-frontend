/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/core';
// @ts-ignore
import ErrorReporter from '@ndla/error-reporter';
import createCache from '@emotion/cache';
// @ts-ignore
import queryString from 'query-string';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Router } from 'react-router-dom';
import { EmotionCacheKey, STORED_LANGUAGE_KEY } from './constants';
import { createHistory } from './history';
import { getLocaleInfoFromPath, isValidLocale } from './i18n';
import { NDLAWindow } from './interfaces';
import routesFunc from './routes';
import './style/index.css';
import { createApolloClient } from './util/apiHelpers';
import { VersionHashProvider } from './components/VersionHashContext';

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { initialProps, config, serverPath, serverQuery },
} = window;

const { abbreviation, basename, basepath } = getLocaleInfoFromPath(
  serverPath ?? '',
);

const { versionHash } = queryString.parse(window.location.search);

const serverQueryString = decodeURIComponent(
  queryString.stringify(serverQuery),
);
const locationFromServer = {
  pathname: basepath || '/',
  search: serverQueryString ? `?${serverQueryString}` : '',
};

const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY);
if (basename && storedLanguage !== basename && isValidLocale(basename)) {
  window.localStorage.setItem(STORED_LANGUAGE_KEY, basename);
} else if (storedLanguage === null || storedLanguage === undefined) {
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

const client = createApolloClient(abbreviation, document.cookie, versionHash);
const cache = createCache({ key: EmotionCacheKey });

// Use memory router if running under google translate
const testLocation = locationFromServer?.pathname + locationFromServer?.search;
const isGoogleUrl =
  decodeURIComponent(window.location.search).indexOf(testLocation) > -1;

interface RCProps {
  children?: ReactNode;
}

const RouterComponent = ({ children }: RCProps) =>
  isGoogleUrl ? (
    <MemoryRouter initialEntries={[locationFromServer]}>
      {children}
    </MemoryRouter>
  ) : (
    <Router history={browserHistory}>{children}</Router>
  );

function canUseDOM() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

function removeUniversalPortals() {
  if (canUseDOM()) {
    document.querySelectorAll('[data-react-universal-portal]').forEach(node => {
      if (node.hasAttribute('data-from-article-converter')) {
        return;
      }
      node.remove();
    });
  }
}

removeUniversalPortals();

renderOrHydrate(
  <ApolloProvider client={client}>
    <CacheProvider value={cache}>
      <VersionHashProvider value={versionHash}>
        <RouterComponent>
          {routesFunc(
            { ...initialProps, basename },
            client,
            //@ts-ignore
            basename,
            true,
            versionHash,
          )}
        </RouterComponent>
      </VersionHashProvider>
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
