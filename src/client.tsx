/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./style/index.css";
import queryString from "query-string";
import { I18nextProvider } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router";
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
import { routes } from "./appRoutes";
import { AlertsProvider } from "./components/AlertsContext";
import AuthenticationContext from "./components/AuthenticationContext";
import { BaseNameProvider } from "./components/BaseNameContext";
import ResponseContext from "./components/ResponseContext";
import { SiteThemeProvider } from "./components/SiteThemeContext";
import { VersionHashProvider } from "./components/VersionHashContext";
import { Document } from "./Document";
import { entryPoints } from "./entrypoints";
import { getLocaleInfoFromPath, initializeI18n, isValidLocale } from "./i18n";
import { NDLAWindow } from "./interfaces";
import { createApolloClient } from "./util/apiHelpers";
import { renderOrHydrate } from "./util/renderOrHydrate";
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

const client = createApolloClient(abbreviation, versionHash);

const router = createBrowserRouter(routes, { basename: basename ? `/${basename}` : undefined });

const i18nInstance = initializeI18n(abbreviation);

renderOrHydrate(
  document,
  <Document
    chunks={chunks}
    language={isValidLocale(abbreviation) ? abbreviation : config.defaultLocale}
    devEntrypoint={entryPoints.default}
  >
    <I18nextProvider i18n={i18nInstance}>
      <ApolloProvider client={client}>
        <ResponseContext value={{ status: serverResponse }}>
          <VersionHashProvider value={versionHash}>
            <SiteThemeProvider value={window.DATA.siteTheme}>
              <AlertsProvider>
                <BaseNameProvider value={basename}>
                  <AuthenticationContext>
                    <RouterProvider router={router} />
                  </AuthenticationContext>
                </BaseNameProvider>
              </AlertsProvider>
            </SiteThemeProvider>
          </VersionHashProvider>
        </ResponseContext>
      </ApolloProvider>
    </I18nextProvider>
  </Document>,
  routes,
);
