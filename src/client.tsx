/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './style/index.css';
import { isMobile } from 'react-device-detect';
import { ApolloProvider, useApolloClient } from '@apollo/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import '@fontsource/source-code-pro/400-italic.css';
import '@fontsource/source-code-pro/700.css';
import '@fontsource/source-code-pro/index.css';
import '@fontsource/source-sans-pro/300-italic.css';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400-italic.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/source-sans-pro/700.css';
import '@fontsource/source-sans-pro/index.css';
import '@fontsource/source-serif-pro/400-italic.css';
import '@fontsource/source-serif-pro/700.css';
import '@fontsource/source-serif-pro/index.css';
// @ts-ignore
import ErrorReporter from '@ndla/error-reporter';
import { i18nInstance } from '@ndla/ui';
import { getCookie, setCookie } from '@ndla/util';
import { createBrowserHistory, createMemoryHistory, History } from 'history';
// @ts-ignore
import queryString from 'query-string';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Router } from 'react-router-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { TaxonomyStructureProvider } from './components/TaxonomyStructureContext';
import { VersionHashProvider } from './components/VersionHashContext';
import { getDefaultLocale } from './config';
import { EmotionCacheKey, STORED_LANGUAGE_COOKIE_KEY } from './constants';
import {
  getLocaleInfoFromPath,
  initializeI18n,
  isValidLocale,
  supportedLanguages,
} from './i18n';
import { NDLAWindow } from './interfaces';
import { createApolloClient, createApolloLinks } from './util/apiHelpers';
import IsMobileContext from './IsMobileContext';

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { config, serverPath, serverQuery },
} = window;

const { basepath, abbreviation } = getLocaleInfoFromPath(serverPath ?? '');

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1] ?? '') ? `${paths[1]}` : undefined;

const { versionHash, taxStructure } = queryString.parse(window.location.search);
const taxStructureValue = taxStructure?.length
  ? taxStructure === 'true'
  : config.taxonomyProgrammesEnabled;

const serverQueryString = decodeURIComponent(
  queryString.stringify(serverQuery),
);
const locationFromServer = {
  pathname: basepath || '/',
  search: serverQueryString ? `?${serverQueryString}` : '',
};

const maybeStoredLanguage = getCookie(
  STORED_LANGUAGE_COOKIE_KEY,
  document.cookie,
);
// Set storedLanguage to a sane value if non-existent
if (maybeStoredLanguage === null || maybeStoredLanguage === undefined) {
  setCookie({
    cookieName: STORED_LANGUAGE_COOKIE_KEY,
    cookieValue: abbreviation,
    lax: true,
  });
}
const storedLanguage = getCookie(STORED_LANGUAGE_COOKIE_KEY, document.cookie)!;
const i18n = initializeI18n(i18nInstance, storedLanguage);

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey: config.logglyApiKey,
  environment: config.ndlaEnvironment,
  componentName: config.componentName,
  ignoreUrls: [/https:\/\/.*hotjar\.com.*/],
});

const client = createApolloClient(storedLanguage, versionHash);
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
  const historyRef = useRef<History>();
  if (isGoogleUrl && historyRef.current == null) {
    historyRef.current = createMemoryHistory({
      initialEntries: [locationFromServer],
    });
  } else if (historyRef.current == null) {
    historyRef.current = createBrowserHistory();
  }

  const history = historyRef.current!;
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={base}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children(history)}
    </Router>
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
    document
      .querySelectorAll('[data-react-universal-portal]')
      .forEach((node) => {
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

  i18n.on('languageChanged', (lang) => {
    setCookie({
      cookieName: STORED_LANGUAGE_COOKIE_KEY,
      cookieValue: lang,
      lax: true,
    });
    client.resetStore();
    client.setLink(createApolloLinks(lang, versionHash));
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
  // only relevant when disableSSR=true
  useLayoutEffect(() => {
    const storedLanguage = getCookie(
      STORED_LANGUAGE_COOKIE_KEY,
      document.cookie,
    )!;
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
      {(_) => <App base={base} />}
    </NDLARouter>
  );
};

removeUniversalPortals();

const renderOrHydrate = (container: HTMLElement, children: ReactNode) => {
  if (config.disableSSR) {
    const root = createRoot(container);
    root.render(children);
  } else {
    hydrateRoot(container, children);
  }
};

renderOrHydrate(
  document.getElementById('root')!,
  <TaxonomyStructureProvider value={taxStructureValue}>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <ApolloProvider client={client}>
          <CacheProvider value={cache}>
            <VersionHashProvider value={versionHash}>
              <IsMobileContext.Provider value={isMobile}>
                <LanguageWrapper basename={basename} />
              </IsMobileContext.Provider>
            </VersionHashProvider>
          </CacheProvider>
        </ApolloProvider>
      </I18nextProvider>
    </HelmetProvider>
  </TaxonomyStructureProvider>,
);

if (module.hot) {
  module.hot.accept();
}
