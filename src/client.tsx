/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./style/index.css";
import queryString from "query-string";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDeviceSelectors } from "react-device-detect";
import { createRoot, hydrateRoot } from "react-dom/client";
import { I18nextProvider, useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, useApolloClient } from "@apollo/client";
import "@fontsource/source-code-pro/400-italic.css";
import "@fontsource/source-code-pro/700.css";
import "@fontsource/source-code-pro/index.css";
import "@fontsource/source-sans-pro/300-italic.css";
import "@fontsource/source-sans-pro/300.css";
import "@fontsource/source-sans-pro/400-italic.css";
import "@fontsource/source-sans-pro/600.css";
import "@fontsource/source-sans-pro/700.css";
import "@fontsource/source-sans-pro/index.css";
import "@fontsource/source-serif-pro/400-italic.css";
import "@fontsource/source-serif-pro/700.css";
import "@fontsource/source-serif-pro/index.css";
import { i18nInstance } from "@ndla/ui";
import { getCookie, setCookie } from "@ndla/util";
import App from "./App";
import ResponseContext from "./components/ResponseContext";
import { SiteThemeProvider } from "./components/SiteThemeContext";
import { VersionHashProvider } from "./components/VersionHashContext";
import { STORED_LANGUAGE_COOKIE_KEY } from "./constants";
import { Document } from "./Document";
import { entryPoints } from "./entrypoints";
import {
  getLangAttributeValue,
  getLocaleInfoFromPath,
  initializeI18n,
  isValidLocale,
  supportedLanguages,
} from "./i18n";
import { NDLAWindow } from "./interfaces";
import { UserAgentProvider } from "./UserAgentContext";
import { createApolloClient, createApolloLinks } from "./util/apiHelpers";
import { initSentry } from "./util/sentry";

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { config, serverPath, serverResponse, chunks },
} = window;

initSentry(config);

const { abbreviation } = getLocaleInfoFromPath(serverPath ?? "");

const paths = window.location.pathname.split("/");
const basename = isValidLocale(paths[1] ?? "") ? `${paths[1]}` : undefined;

const { versionHash } = queryString.parse(window.location.search);

const maybeStoredLanguage = getCookie(STORED_LANGUAGE_COOKIE_KEY, document.cookie);
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

const client = createApolloClient(storedLanguage, versionHash);

const constructNewPath = (newLocale?: string) => {
  const regex = new RegExp(`\\/(${supportedLanguages.join("|")})($|\\/)`, "");
  const path = window.location.pathname.replace(regex, "");
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const localePrefix = newLocale ? `/${newLocale}` : "";
  return `${localePrefix}${fullPath}${window.location.search}`;
};

const useReactPath = () => {
  const [path, setPath] = useState("");
  const listenToPopstate = () => {
    const winPath = window.location.pathname;
    setPath(winPath);
  };
  useEffect(() => {
    window.addEventListener("popstate", listenToPopstate);
    window.addEventListener("pushstate", listenToPopstate);
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
      window.removeEventListener("pushstate", listenToPopstate);
    };
  }, []);
  return path;
};

const LanguageWrapper = ({ basename }: { basename?: string }) => {
  const { i18n } = useTranslation();
  const [base, setBase] = useState(basename ?? "");
  const firstRender = useRef(true);
  const client = useApolloClient();
  const windowPath = useReactPath();
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  i18n.on("languageChanged", (lang) => {
    setCookie({
      cookieName: STORED_LANGUAGE_COOKIE_KEY,
      cookieValue: lang,
      lax: true,
    });
    client.resetStore();
    client.setLink(createApolloLinks(lang, versionHash));
    document.documentElement.lang = getLangAttributeValue(lang);
  });

  // handle path changes when the language is changed
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      window.history.replaceState("", "", constructNewPath(i18n.language));
      setBase(i18n.language);
    }
  }, [i18n.language]);

  // handle initial redirect if URL has wrong or missing locale prefix.
  // only relevant when disableSSR=true
  useLayoutEffect(() => {
    const storedLanguage = getCookie(STORED_LANGUAGE_COOKIE_KEY, document.cookie)!;
    if (storedLanguage === config.defaultLocale && !base) return;
    if (isValidLocale(storedLanguage) && storedLanguage === base) {
      setBase(storedLanguage);
    }
    if (window.location.pathname.includes("/login/success")) return;
    setBase(storedLanguage);
    window.history.replaceState("", "", constructNewPath(storedLanguage));
  }, [base, windowPath]);

  return (
    <UserAgentProvider value={selectors}>
      <BrowserRouter key={base} basename={base}>
        <App base={base} />
      </BrowserRouter>
    </UserAgentProvider>
  );
};

const renderOrHydrate = (container: Element | Document, children: ReactNode) => {
  if (config.disableSSR) {
    const root = createRoot(container);
    root.render(children);
  } else {
    hydrateRoot(container, children);
  }
};

renderOrHydrate(
  document,
  <Document
    chunks={chunks}
    language={isValidLocale(storedLanguage) ? storedLanguage : config.defaultLocale}
    devEntrypoint={entryPoints.default}
  >
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={client}>
        <ResponseContext.Provider value={{ status: serverResponse }}>
          <VersionHashProvider value={versionHash}>
            <SiteThemeProvider value={window.DATA.siteTheme}>
              <LanguageWrapper basename={basename} />
            </SiteThemeProvider>
          </VersionHashProvider>
        </ResponseContext.Provider>
      </ApolloProvider>
    </I18nextProvider>
  </Document>,
);
