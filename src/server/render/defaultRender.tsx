/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloProvider } from "@apollo/client/react";
import { prerenderStatic } from "@apollo/client/react/ssr";
import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { routes } from "../../appRoutes";
import { AuthenticationContext } from "../../components/AuthenticationContext";
import { RedirectContext, RedirectInfo } from "../../components/RedirectContext";
import { ResponseContext, ResponseInfo } from "../../components/ResponseContext";
import { RestrictedModeProvider } from "../../components/RestrictedModeContext";
import { SiteThemeProvider } from "../../components/SiteThemeContext";
import { VersionHashProvider } from "../../components/VersionHashContext";
import config from "../../config";
import { Document } from "../../Document";
import { getLocaleInfoFromPath, isValidLocale } from "../../i18n";
import { LocaleType } from "../../interfaces";
import { MOVED_PERMANENTLY, OK, TEMPORARY_REDIRECT } from "../../statusCodes";
import { createApolloClient } from "../../util/apiHelpers";
import { getSiteTheme } from "../../util/siteTheme";
import { getLazyLoadedChunks } from "../getManifestChunks";
import { isRestrictedMode } from "../helpers/restrictedMode";
import { initializeI18n, stringifiedLanguages } from "../locales/locales";
import { createFetchRequest } from "../request";
import { RenderFunc } from "../serverHelpers";
import { disableSSR } from "./renderHelpers";

export const defaultRender: RenderFunc = async (req, chunkInfo) => {
  const { basename, basepath, abbreviation } = getLocaleInfoFromPath(req.originalUrl);
  const locale = isValidLocale(abbreviation) ? abbreviation : (config.defaultLocale as LocaleType);
  if ((basename === "" && locale !== "nb") || (basename && basename !== locale)) {
    return {
      status: TEMPORARY_REDIRECT,
      location: `/${locale}${basepath}`,
    };
  }

  const siteTheme = getSiteTheme();
  const restrictedMode = isRestrictedMode(req);
  const versionHash = typeof req.query.versionHash === "string" ? req.query.versionHash : undefined;
  const noSSR = disableSSR(req);
  const hash = stringifiedLanguages[locale].hash;

  const lazyChunkInfo = getLazyLoadedChunks(routes, req.path, chunkInfo);

  if (noSSR) {
    return {
      status: OK,
      locale,
      data: {
        htmlContent: renderToString(<Document language={locale} chunkInfo={lazyChunkInfo} hash={hash} />),
        data: {
          config: { ...config, disableSSR: true },
          siteTheme,
          restrictedMode,
          chunkInfo: lazyChunkInfo,
          hash,
          serverPath: req.path,
          serverQuery: req.query,
        },
      },
    };
  }

  const client = createApolloClient(locale, versionHash);
  const instance = initializeI18n(locale);
  const redirectContext: RedirectInfo = {};
  const responseContext: ResponseInfo = {};

  const { query, dataRoutes } = createStaticHandler(routes, {
    basename: basename?.length ? `/${basename}` : undefined,
  });
  const fetchRequest = createFetchRequest(req);
  const context = await query(fetchRequest);

  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);

  const Page = (
    <Document language={locale} chunkInfo={lazyChunkInfo} hash={hash}>
      <RedirectContext value={redirectContext}>
        <I18nextProvider i18n={instance}>
          <ApolloProvider client={client}>
            <ResponseContext value={responseContext}>
              <VersionHashProvider value={versionHash}>
                <RestrictedModeProvider value={restrictedMode}>
                  <SiteThemeProvider value={siteTheme}>
                    <AuthenticationContext>
                      <StaticRouterProvider router={router} context={context} hydrate={false} />
                    </AuthenticationContext>
                  </SiteThemeProvider>
                </RestrictedModeProvider>
              </VersionHashProvider>
            </ResponseContext>
          </ApolloProvider>
        </I18nextProvider>
      </RedirectContext>
    </Document>
  );

  const result = await prerenderStatic({ tree: Page, renderFunction: renderToString });

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
      htmlContent: result.result,
      data: {
        siteTheme: siteTheme,
        restrictedMode,
        chunkInfo: lazyChunkInfo,
        hash,
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
