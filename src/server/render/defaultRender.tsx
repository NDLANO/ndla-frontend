/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { getSelectorsByUserAgent } from "react-device-detect";
import { FilledContext, HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router-dom/server";
import { ApolloProvider } from "@apollo/client/react";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { i18nInstance } from "@ndla/ui";
import { disableSSR } from "./renderHelpers";
import App from "../../App";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import { VersionHashProvider } from "../../components/VersionHashContext";
import config from "../../config";
import { EmotionCacheKey } from "../../constants";
import { getLocaleInfoFromPath, initializeI18n, isValidLocale } from "../../i18n";
import { MOVED_PERMANENTLY, OK } from "../../statusCodes";
import { UserAgentProvider } from "../../UserAgentContext";
import { createApolloClient } from "../../util/apiHelpers";
import { RenderFunc } from "../serverHelpers";

export const defaultRender: RenderFunc = async (req) => {
  const { basename, abbreviation } = getLocaleInfoFromPath(req.originalUrl);
  const locale = isValidLocale(abbreviation) ? abbreviation : config.defaultLocale;

  const userAgent = req.headers["user-agent"];
  const userAgentSelectors = userAgent ? getSelectorsByUserAgent(userAgent) : undefined;
  const versionHash = typeof req.query.versionHash === "string" ? req.query.versionHash : undefined;
  const noSSR = disableSSR(req);

  if (noSSR) {
    return {
      status: OK,
      data: {
        htmlContent: "",
        data: {
          config: { ...config, disableSSR: noSSR },
          serverPath: req.path,
          serverQuery: req.query,
        },
      },
    };
  }

  const client = createApolloClient(locale, versionHash);
  const cache = createCache({ key: EmotionCacheKey });
  const i18n = initializeI18n(i18nInstance, locale);
  const context: RedirectInfo = {};
  // @ts-ignore
  const helmetContext: FilledContext = {};

  const Page = (
    <RedirectContext.Provider value={context}>
      <HelmetProvider context={helmetContext}>
        <I18nextProvider i18n={i18n}>
          <ApolloProvider client={client}>
            <CacheProvider value={cache}>
              <VersionHashProvider value={versionHash}>
                <UserAgentProvider value={userAgentSelectors}>
                  <StaticRouter basename={basename} location={req.url}>
                    <App key={locale} />
                  </StaticRouter>
                </UserAgentProvider>
              </VersionHashProvider>
            </CacheProvider>
          </ApolloProvider>
        </I18nextProvider>
      </HelmetProvider>
    </RedirectContext.Provider>
  );

  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
  const html = await renderToStringWithData(Page);

  if (context.url) {
    return {
      status: context.status || MOVED_PERMANENTLY,
      location: context.url,
    };
  }

  const chunks = extractCriticalToChunks(html);
  const styles = constructStyleTagsFromChunks(chunks);
  const apolloState = client.extract();

  return {
    status: context.status ?? OK,
    data: {
      styles,
      helmetContext,
      htmlContent: html,
      data: {
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
