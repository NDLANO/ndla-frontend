/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './style/index.css';
//@ts-ignore
import queryString from 'query-string';
import { ReactNode } from 'react';
import { useDeviceSelectors } from 'react-device-detect';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
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
import App from './App';
import { VersionHashProvider } from './components/VersionHashContext';
import { EmotionCacheKey } from './constants';
import { getLocaleInfoFromPath, initializeI18n, isValidLocale } from './i18n';
import { NDLAWindow } from './interfaces';
import { UserAgentProvider } from './UserAgentContext';
import { createApolloClient } from './util/apiHelpers';

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { config, serverPath, serverQuery },
} = window;

const { basepath } = getLocaleInfoFromPath(serverPath ?? '');

const paths = window.location.pathname.split('/');
const lang = isValidLocale(paths[1] ?? '') ? `${paths[1]}` : undefined;

const { versionHash } = queryString.parse(window.location.search);

const serverQueryString = decodeURIComponent(
  queryString.stringify(serverQuery),
);
const locationFromServer = {
  pathname: basepath || '/',
  search: serverQueryString ? `?${serverQueryString}` : '',
};

// const maybeStoredLanguage = getCookie(
//   STORED_LANGUAGE_COOKIE_KEY,
//   document.cookie,
// );
// Set storedLanguage to a sane value if non-existent
// if (maybeStoredLanguage === null || maybeStoredLanguage === undefined) {
//   setCookie({
//     cookieName: STORED_LANGUAGE_COOKIE_KEY,
//     cookieValue: abbreviation,
//     lax: true,
//   });
// }
// const storedLanguage = getCookie(STORED_LANGUAGE_COOKIE_KEY, document.cookie)!;
const i18n = initializeI18n(i18nInstance, lang ?? config.defaultLocale);

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey: config.logglyApiKey,
  environment: config.ndlaEnvironment,
  componentName: config.componentName,
  ignoreUrls: [],
});

const client = createApolloClient(lang, versionHash);
const cache = createCache({ key: EmotionCacheKey });

// Use memory router if running under google translate
const testLocation = locationFromServer?.pathname + locationFromServer?.search;
const isGoogleUrl =
  decodeURIComponent(window.location.search).indexOf(testLocation) > -1;

interface RCProps {
  children: ReactNode;
}

const RouterComponent = ({ children }: RCProps) =>
  isGoogleUrl ? (
    <MemoryRouter initialEntries={[locationFromServer]}>
      {children}
    </MemoryRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );

// const constructNewPath = (newLocale?: string) => {
//   const regex = new RegExp(`\\/(${supportedLanguages.join('|')})($|\\/)`, '');
//   const path = window.location.pathname.replace(regex, '');
//   const fullPath = path.startsWith('/') ? path : `/${path}`;
//   const localePrefix = newLocale ? `/${newLocale}` : '';
//   return `${localePrefix}${fullPath}${window.location.search}`;
// };
//
// const useReactPath = () => {
//   const [path, setPath] = useState('');
//   const listenToPopstate = () => {
//     const winPath = window.location.pathname;
//     setPath(winPath);
//   };
//   useEffect(() => {
//     window.addEventListener('popstate', listenToPopstate);
//     window.addEventListener('pushstate', listenToPopstate);
//     return () => {
//       window.removeEventListener('popstate', listenToPopstate);
//       window.removeEventListener('pushstate', listenToPopstate);
//     };
//   }, []);
//   return path;
// };

const LanguageWrapper = () => {
  // const { i18n } = useTranslation();
  // const [base, setBase] = useState(basename ?? '');
  // const firstRender = useRef(true);
  // const client = useApolloClient();
  // const windowPath = useReactPath();
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  //
  // // handle path changes when the language is changed
  // useLayoutEffect(() => {
  //   if (firstRender.current) {
  //     firstRender.current = false;
  //   } else {
  //     window.history.replaceState('', '', constructNewPath(i18n.language));
  //     setBase(i18n.language);
  //   }
  // }, [i18n.language]);

  // handle initial redirect if URL has wrong or missing locale prefix.
  // only relevant when disableSSR=true
  // useLayoutEffect(() => {
  //   const storedLanguage = getCookie(
  //     STORED_LANGUAGE_COOKIE_KEY,
  //     document.cookie,
  //   )!;
  //   if (storedLanguage === getDefaultLocale() && !base) return;
  //   if (isValidLocale(storedLanguage) && storedLanguage === base) {
  //     setBase(storedLanguage);
  //   }
  //   if (window.location.pathname.includes('/login/success')) return;
  //   setBase(storedLanguage);
  //   window.history.replaceState('', '', constructNewPath(storedLanguage));
  // }, [base, windowPath]);

  return (
    <UserAgentProvider value={selectors}>
      <RouterComponent>
        <App />
      </RouterComponent>
    </UserAgentProvider>
  );
};

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
  <HelmetProvider>
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={client}>
        <CacheProvider value={cache}>
          <VersionHashProvider value={versionHash}>
            <LanguageWrapper />
          </VersionHashProvider>
        </CacheProvider>
      </ApolloProvider>
    </I18nextProvider>
  </HelmetProvider>,
);

if (module.hot) {
  module.hot.accept();
}
