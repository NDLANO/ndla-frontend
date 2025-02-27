/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getSelectorsByUserAgent } from "react-device-detect";
import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router-dom/server";
import { ApolloProvider } from "@apollo/client/react";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import { i18nInstance } from "@ndla/ui";
import { disableSSR } from "./renderHelpers";
import App from "../../App";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import ResponseContext, { ResponseInfo } from "../../components/ResponseContext";
import { SiteThemeProvider } from "../../components/SiteThemeContext";
import { VersionHashProvider } from "../../components/VersionHashContext";
import config from "../../config";
import { Document } from "../../Document";
import { entryPoints } from "../../entrypoints";
import { getLocaleInfoFromPath, initializeI18n } from "../../i18n";
import { MOVED_PERMANENTLY, OK, TEMPORARY_REDIRECT } from "../../statusCodes";
import { UserAgentProvider } from "../../UserAgentContext";
import { createApolloClient } from "../../util/apiHelpers";
import { getSiteTheme } from "../../util/siteTheme";
import { RenderFunc } from "../serverHelpers";

export const defaultRender: RenderFunc = async (req, chunks) => {
  const { basename, basepath, abbreviation } = getLocaleInfoFromPath(req.originalUrl);
  const locale = abbreviation;
  if ((basename === "" && locale !== "nb") || (basename && basename !== locale)) {
    return {
      status: TEMPORARY_REDIRECT,
      location: `/${locale}${basepath}`,
    };
  }

  const siteTheme = getSiteTheme();

  const userAgent = req.headers["user-agent"];
  const userAgentSelectors = userAgent ? getSelectorsByUserAgent(userAgent) : undefined;
  const versionHash = typeof req.query.versionHash === "string" ? req.query.versionHash : undefined;
  const noSSR = disableSSR(req);

  if (noSSR) {
    return {
      status: OK,
      locale,
      data: {
        htmlContent: renderToString(<Document language={locale} chunks={chunks} devEntrypoint={entryPoints.default} />),
        data: {
          config: { ...config, disableSSR: noSSR },
          siteTheme,
          chunks,
          serverPath: req.path,
          serverQuery: req.query,
        },
      },
    };
  }

  const client = createApolloClient(locale, versionHash, req.path);
  const i18n = initializeI18n(i18nInstance, locale);
  const redirectContext: RedirectInfo = {};
  const responseContext: ResponseInfo = {};

  const Page = (
    <Document language={locale} chunks={chunks} devEntrypoint={entryPoints.default}>
      <RedirectContext.Provider value={redirectContext}>
        <I18nextProvider i18n={i18n}>
          <ApolloProvider client={client}>
            <ResponseContext.Provider value={responseContext}>
              <VersionHashProvider value={versionHash}>
                <UserAgentProvider value={userAgentSelectors}>
                  <SiteThemeProvider value={siteTheme}>
                    <StaticRouter basename={basename} location={req.url}>
                      <App key={locale} />
                    </StaticRouter>
                  </SiteThemeProvider>
                </UserAgentProvider>
              </VersionHashProvider>
            </ResponseContext.Provider>
          </ApolloProvider>
        </I18nextProvider>
      </RedirectContext.Provider>
    </Document>
  );

  const html = await renderToStringWithData(Page);

  if (redirectContext.url) {
    return {
      status: redirectContext.status || MOVED_PERMANENTLY,
      location: redirectContext.url,
    };
  }

  const apolloState = client.extract();

  return {
    status: redirectContext.status ?? OK,
    locale,
    data: {
      htmlContent: html,
      data: {
        siteTheme: siteTheme,
        chunks,
        serverResponse: redirectContext.status ?? undefined,
        serverPath: req.path,
        serverQuery: req.query,
        apolloState,
        config: {
          ...config,
          disableSSR: noSSR,
        },
      },
    },
  };
};
