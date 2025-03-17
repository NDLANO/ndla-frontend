/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./style/index.css";
import queryString from "query-string";
import { ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
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
import { getLocaleInfoFromPath, initializeI18n, isValidLocale } from "./i18n";
import { NDLAWindow } from "./interfaces";
import { createApolloClient } from "./util/apiHelpers";
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

const LanguageWrapper = ({ basename }: { basename?: string }) => {
  return (
    <BrowserRouter key={basename} basename={basename}>
      <App base={basename} />
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
