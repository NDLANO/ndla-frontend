/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./style/index.css";
import queryString from "query-string";
import { ReactNode, useLayoutEffect, useRef, useState } from "react";
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
import App from "./App";
import ResponseContext from "./components/ResponseContext";
import { SiteThemeProvider } from "./components/SiteThemeContext";
import { VersionHashProvider } from "./components/VersionHashContext";
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

const i18n = initializeI18n(i18nInstance, abbreviation);
const client = createApolloClient(abbreviation, versionHash);

const constructNewPath = (newLocale?: string) => {
  const regex = new RegExp(`\\/(${supportedLanguages.join("|")})($|\\/)`, "");
  const path = window.location.pathname.replace(regex, "");
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const localePrefix = newLocale ? `/${newLocale}` : "";
  return `${localePrefix}${fullPath}${window.location.search}`;
};

const LanguageWrapper = ({ basename }: { basename?: string }) => {
  const { i18n } = useTranslation();
  const [base, setBase] = useState(basename ?? "");
  const firstRender = useRef(true);
  const client = useApolloClient();

  i18n.on("languageChanged", (lang) => {
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

  return (
    <BrowserRouter key={base} basename={base}>
      <App base={base} />
    </BrowserRouter>
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
    language={isValidLocale(abbreviation) ? abbreviation : config.defaultLocale}
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
