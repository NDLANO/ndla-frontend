/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ApolloProvider, useApolloClient } from '@apollo/client';
import { CacheProvider } from '@emotion/core';
import { createBrowserHistory, createMemoryHistory, History } from 'history';
// @ts-ignore
import ErrorReporter from '@ndla/error-reporter';
import { i18nInstance } from '@ndla/ui';
import createCache from '@emotion/cache';
// @ts-ignore
import queryString from 'query-string';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
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
import { VersionHashProvider } from './components/VersionHashContext';

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { config, serverPath, serverQuery, resCookie },
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
// Set storedLanguage to a sane value if non-existent
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
  children: (history: History) => ReactNode;
  base: string;
}

/*
  This is a custom router based on the source code of BrowserRouter and MemoryRouter from
  react-router-dom@6.3.0. It's intended purpose is to provide App with an instance of
  the internal history object without using the UNSAFE navigation context provided by RR,
  as well as setting and replacing the Router basename in a safe way. The exposed history
  object should not be used or passed to anyting else than configureTracker.
*/
const NDLARouter = ({ children, base }: RCProps) => {
  let historyRef = useRef<History>();
  if (isGoogleUrl && historyRef.current == null) {
    historyRef.current = createMemoryHistory({
      initialEntries: [locationFromServer],
    });
  } else if (historyRef.current == null) {
    historyRef.current = createBrowserHistory();
  }

  let history = historyRef.current!;
  let [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={base}
      children={children(history)}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

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
  const regex = new RegExp(`\\/(${supportedLanguages.join('|')})($|\\/)`, '');
  const path = window.location.pathname.replace(regex, '');
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const localePrefix = newLocale ? `/${newLocale}` : '';
  return `${localePrefix}${fullPath}${window.location.search}`;
};

const useReactPath = () => {
  const [path, setPath] = useState('');
  const listenToPopstate = () => {
    const winPath = window.location.pathname;
    setPath(winPath);
  };
  useEffect(() => {
    window.addEventListener('popstate', listenToPopstate);
    window.addEventListener('pushstate', listenToPopstate);
    return () => {
      window.removeEventListener('popstate', listenToPopstate);
      window.removeEventListener('pushstate', listenToPopstate);
    };
  }, []);
  return path;
};

const LanguageWrapper = ({ basename }: { basename?: string }) => {
  const { i18n } = useTranslation();
  const [base, setBase] = useState(basename ?? '');
  const firstRender = useRef(true);
  const client = useApolloClient();
  const windowPath = useReactPath();

  i18n.on('languageChanged', lang => {
    client.resetStore();
    client.setLink(createApolloLinks(lang, resCookie, versionHash));
    window.localStorage.setItem(STORED_LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
  });

  // handle path changes when the language is changed
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      window.history.replaceState('', '', constructNewPath(i18n.language));
      setBase(i18n.language);
    }
  }, [i18n.language]);

  // handle initial redirect if URL has wrong or missing locale prefix.
  useLayoutEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORED_LANGUAGE_KEY)!;
    if (storedLanguage === getDefaultLocale() && !base) return;
    if (isValidLocale(storedLanguage) && storedLanguage === base) {
      setBase(storedLanguage);
    }
    if (window.location.pathname.includes('/login/success')) return;
    setBase(storedLanguage);
    window.history.replaceState('', '', constructNewPath(storedLanguage));
  }, [base, windowPath]);

  return (
    <NDLARouter key={base} base={base}>
      {history => (
        <App locale={i18n.language} resCookie={resCookie} history={history} isClient base={base} />
      )}
    </NDLARouter>
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
