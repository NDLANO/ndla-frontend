/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetProvider } from 'react-helmet-async';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ApolloProvider, useApolloClient } from '@apollo/client';
import { CacheProvider } from '@emotion/core';
// @ts-ignore
import ErrorReporter from '@ndla/error-reporter';
import { i18nInstance } from '@ndla/ui';
import createCache from '@emotion/cache';
// @ts-ignore
import queryString from 'query-string';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { EmotionCacheKey, STORED_LANGUAGE_KEY } from './constants';
import {
  getLocaleInfoFromPath,
  initializeI18n,
  isValidLocale,
  supportedLanguages,
} from './i18n';
import { NDLAWindow } from './interfaces';
import './style/index.css';
import { createApolloClient, createApolloLinks } from './util/apiHelpers';
import { getDefaultLocale } from './config';
import App from './App';
import {
  useVersionHash,
  VersionHashProvider,
} from './components/VersionHashContext';

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { initialProps, config, serverPath, serverQuery },
} = window;

const { basepath } = getLocaleInfoFromPath(serverPath ?? '');

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1] ?? '') ? `${paths[1]}` : undefined;

const { versionHash } = queryString.parse(window.location.search);

const serverQueryString = decodeURIComponent(
  queryString.stringify(serverQuery),
);
const locationFromServer = {
  pathname: basepath || '/',
  search: serverQueryString ? `?${serverQueryString}` : '',
};

const maybeStoredLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY);
// Set storedLanguage to a sane value if it non-existent.
if (maybeStoredLanguage === null || maybeStoredLanguage === undefined) {
  window.localStorage.setItem(STORED_LANGUAGE_KEY, config.defaultLocale);
}
const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY)!;
const i18n = initializeI18n(i18nInstance, storedLanguage);
window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey: config.logglyApiKey,
  environment: config.ndlaEnvironment,
  componentName: config.componentName,
  ignoreUrls: [/https:\/\/.*hotjar\.com.*/],
});

window.hasHydrated = false;
const renderOrHydrate = config.disableSSR ? ReactDOM.render : ReactDOM.hydrate;

const client = createApolloClient(basename, document.cookie, versionHash);
const cache = createCache({ key: EmotionCacheKey });

// Use memory router if running under google translate
const testLocation = locationFromServer?.pathname + locationFromServer?.search;
const isGoogleUrl =
  decodeURIComponent(window.location.search).indexOf(testLocation) > -1;

interface RCProps {
  children?: ReactNode;
  base: string;
}

const RouterComponent = ({ children, base }: RCProps) =>
  isGoogleUrl ? (
    <MemoryRouter initialEntries={[locationFromServer]}>
      {children}
    </MemoryRouter>
  ) : (
    <BrowserRouter key={base} basename={base}>
      {children}
    </BrowserRouter>
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
const constructNewPath = (newLocale?: string) => {
  const regex = new RegExp(supportedLanguages.map(l => `/${l}/`).join('|'));
  const path = window.location.pathname.replace(regex, '');
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const localePrefix = newLocale ? `/${newLocale}` : '';
  return `${localePrefix}${fullPath}${window.location.search}`;
};

const LanguageWrapper = ({ basename }: { basename?: string }) => {
  const { i18n } = useTranslation();
  const [base, setBase] = useState('');
  const versionHash = useVersionHash();
  const firstRender = useRef(true);
  const client = useApolloClient();

  i18n.on('languageChanged', lang => {
    client.resetStore();
    client.setLink(createApolloLinks(lang, undefined, versionHash));
    window.localStorage.setItem(STORED_LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
  });

  // handle path changes when the language is changed
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      window.history.replaceState('', '', constructNewPath(i18n.language));
      setBase(i18n.language);
    }
  }, [i18n.language]);

  // handle initial redirect if URL has wrong or missing locale prefix.
  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY);
    if (!storedLanguage || storedLanguage === getDefaultLocale()) return;
    if (isValidLocale(storedLanguage) && storedLanguage === basename) {
      setBase(storedLanguage);
      return;
    }
    if (window.location.pathname.includes('/login/success')) return;
    setBase(storedLanguage);
    window.history.replaceState('', '', constructNewPath(storedLanguage));
  }, [basename]);

  return (
    <RouterComponent base={base}>
      <CompatRouter>
        <App
          initialProps={initialProps}
          isClient
          client={client}
          base={base}
          locale={i18n.language}
          key={i18n.language}
          versionHash={versionHash}
        />
      </CompatRouter>
    </RouterComponent>
  );
};

removeUniversalPortals();

renderOrHydrate(
  <HelmetProvider>
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={client}>
        <CacheProvider value={cache}>
          <VersionHashProvider value={versionHash}>
            <LanguageWrapper basename={basename} />
          </VersionHashProvider>
        </CacheProvider>
      </ApolloProvider>
    </I18nextProvider>
  </HelmetProvider>,
  document.getElementById('root'),
  () => {
    // See: /src/util/transformArticle.js for info on why this is needed.
    window.hasHydrated = true;
  },
);

if (module.hot) {
  module.hot.accept();
}
