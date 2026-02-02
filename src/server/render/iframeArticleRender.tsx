/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloProvider } from "@apollo/client/react";
import { prerenderStatic } from "@apollo/client/react/ssr";
import { MissingRouterContext } from "@ndla/safelink";
import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { RedirectContext, RedirectInfo } from "../../components/RedirectContext";
import { RestrictedModeProvider } from "../../components/RestrictedModeContext";
import config from "../../config";
import { Document } from "../../Document";
import { getHtmlLang, isValidLocale } from "../../i18n";
import { iframeArticleRoutes } from "../../iframe/iframeArticleRoutes";
import { LocaleType } from "../../interfaces";
import { MOVED_PERMANENTLY, OK } from "../../statusCodes";
import { createApolloClient } from "../../util/apiHelpers";
import { getLazyLoadedChunks } from "../getManifestChunks";
import { isRestrictedMode } from "../helpers/restrictedMode";
import { initializeI18n, stringifiedLanguages } from "../locales/locales";
import { createFetchRequest } from "../request";
import { RenderFunc } from "../serverHelpers";
import { disableSSR } from "./renderHelpers";

const { query, dataRoutes } = createStaticHandler(iframeArticleRoutes);

export const iframeArticleRender: RenderFunc = async (req, chunkInfo) => {
  const lang = req.params.lang ?? "";
  const htmlLang = getHtmlLang(lang);
  const locale = isValidLocale(htmlLang) ? htmlLang : undefined;
  const { articleId, taxonomyId } = req.params;
  const hash = stringifiedLanguages[locale ?? (config.defaultLocale as LocaleType)].hash;

  const lazyChunkInfo = getLazyLoadedChunks(iframeArticleRoutes, req.path, chunkInfo);

  const noSSR = disableSSR(req);

  const initialProps = {
    basename: lang,
    articleId,
    taxonomyId,
    locale,
  };
  const restrictedMode = isRestrictedMode(req);

  if (noSSR) {
    return {
      status: OK,
      locale: locale ?? (config.defaultLocale as LocaleType),
      data: {
        htmlContent: renderToString(
          <Document language={locale ?? config.defaultLocale} chunkInfo={lazyChunkInfo} hash={hash} />,
        ),
        data: {
          chunkInfo: lazyChunkInfo,
          config: { ...config, disableSSR: true },
          initialProps,
          hash,
          restrictedMode,
        },
      },
    };
  }

  const client = createApolloClient(locale);
  const i18n = initializeI18n(locale ?? config.defaultLocale);
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
        chunkInfo: lazyChunkInfo,
        apolloState,
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
