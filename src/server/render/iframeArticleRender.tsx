/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetProvider, FilledContext } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router-dom/server";
import { ApolloProvider } from "@apollo/client";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { i18nInstance } from "@ndla/ui";
import { disableSSR } from "./renderHelpers";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import config from "../../config";
import { EmotionCacheKey } from "../../constants";
import { getHtmlLang, initializeI18n, isValidLocale } from "../../i18n";
import IframePageContainer from "../../iframe/IframePageContainer";
import { MOVED_PERMANENTLY, OK } from "../../statusCodes";
import { createApolloClient } from "../../util/apiHelpers";
import { RenderFunc } from "../serverHelpers";

export const iframeArticleRender: RenderFunc = async (req) => {
  const lang = req.params.lang ?? "";
  const htmlLang = getHtmlLang(lang);
  const locale = isValidLocale(htmlLang) ? htmlLang : undefined;
  const { articleId, taxonomyId } = req.params;

  const noSSR = disableSSR(req);

  const initialProps = {
    basename: lang,
    articleId,
    taxonomyId,
    locale,
    // TODO: I think this is always true. Can probably remove.
    isOembed: "true",
    status: "success" as const,
  };

  if (noSSR) {
    return {
      status: OK,
      data: {
        htmlContent: "",
        data: {
          config: { ...config, disableSSR: true },
          initialProps,
        },
      },
    };
  }

  const client = createApolloClient(locale);
  const cache = createCache({ key: EmotionCacheKey });
  const i18n = initializeI18n(i18nInstance, locale ?? config.defaultLocale);
  const context: RedirectInfo = {};
  // @ts-ignore
  const helmetContext: FilledContext = {};

  const Page = (
    <RedirectContext.Provider value={context}>
      <HelmetProvider context={helmetContext}>
        <I18nextProvider i18n={i18n}>
          <ApolloProvider client={client}>
            <CacheProvider value={cache}>
              <StaticRouter location={req.url}>
                <IframePageContainer {...initialProps} />
              </StaticRouter>
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
        apolloState,
        config: {
          ...config,
          disableSSR: noSSR,
        },
        initialProps,
      },
    },
  };
};
