/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { ApolloProvider } from "@apollo/client/react";
import { prerenderStatic } from "@apollo/client/react/ssr";
import { MissingRouterContext } from "@ndla/safelink";
import { disableSSR } from "./renderHelpers";
import { RedirectContext, RedirectInfo } from "../../components/RedirectContext";
import { RestrictedModeProvider } from "../../components/RestrictedModeContext";
import config from "../../config";
import { Document } from "../../Document";
import { getHtmlLang, isValidLocale } from "../../i18n";
import { iframeEmbedRoutes } from "../../iframe/embedIframeRoutes";
import { LocaleType } from "../../interfaces";
import { MOVED_PERMANENTLY, OK } from "../../statusCodes";
import { createApolloClient } from "../../util/apiHelpers";
import { getLazyLoadedChunks } from "../getManifestChunks";
import { isRestrictedMode } from "../helpers/restrictedMode";
import { initializeI18n, stringifiedLanguages } from "../locales/locales";
import { createFetchRequest } from "../request";
import { RenderFunc } from "../serverHelpers";

const { query, dataRoutes } = createStaticHandler(iframeEmbedRoutes);

export const iframeEmbedRender: RenderFunc = async (req, chunkInfo) => {
  const lang = req.params.lang ?? "";
  const htmlLang = getHtmlLang(lang);
  const locale = isValidLocale(htmlLang) ? htmlLang : undefined;
  const { embedType, embedId } = req.params;

  const noSSR = disableSSR(req);

  const initialProps = { basename: lang, embedType, embedId, locale };
  const hash = stringifiedLanguages[locale ?? (config.defaultLocale as LocaleType)].hash;
  const restrictedMode = isRestrictedMode(req);

  const lazyChunkInfo = getLazyLoadedChunks(iframeEmbedRoutes, req.path, chunkInfo);

  if (noSSR) {
    return {
      status: OK,
      locale: locale ?? (config.defaultLocale as LocaleType),
      data: {
        htmlContent: renderToString(
          <Document language={locale ?? (config.defaultLocale as LocaleType)} chunkInfo={lazyChunkInfo} hash={hash} />,
        ),
        data: {
          config: { ...config, disableSSR: true },
          chunkInfo: lazyChunkInfo,
          initialProps,
          hash,
          restrictedMode,
        },
      },
    };
  }

  const client = createApolloClient(locale, undefined);
  const i18n = initializeI18n(locale ?? (config.defaultLocale as LocaleType));
  const context: RedirectInfo = {};

  const fetchRequest = createFetchRequest(req);
  const routerContext = await query(fetchRequest);

  if (routerContext instanceof Response) {
    throw routerContext;
  }

  const router = createStaticRouter(dataRoutes, routerContext);

  const Page = (
    <Document language={locale ?? config.defaultLocale} chunkInfo={lazyChunkInfo} hash={hash}>
      <RedirectContext value={context}>
        <RestrictedModeProvider value={restrictedMode}>
          <I18nextProvider i18n={i18n}>
            <ApolloProvider client={client}>
              <MissingRouterContext value={true}>
                <StaticRouterProvider router={router} context={routerContext} hydrate={false} />
              </MissingRouterContext>
            </ApolloProvider>
          </I18nextProvider>
        </RestrictedModeProvider>
      </RedirectContext>
    </Document>
  );

  const result = await prerenderStatic({ tree: Page, renderFunction: renderToString });

  if (context.url) {
    return {
      status: context.status || MOVED_PERMANENTLY,
      location: context.url,
    };
  }

  const apolloState = client.extract();

  return {
    status: context.status ?? OK,
    locale: locale ?? (config.defaultLocale as LocaleType),
    data: {
      htmlContent: result.result,
      data: {
        apolloState,
        chunkInfo: lazyChunkInfo,
        config: {
          ...config,
          disableSSR: noSSR,
        },
        initialProps,
        hash,
        restrictedMode,
      },
    },
  };
};
