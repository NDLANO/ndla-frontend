/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router-dom/server";
import { ApolloProvider } from "@apollo/client";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import { i18nInstance } from "@ndla/ui";
import { disableSSR } from "./renderHelpers";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import config from "../../config";
import { Document } from "../../Document";
import { entryPoints } from "../../entrypoints";
import { getHtmlLang, initializeI18n, isValidLocale } from "../../i18n";
import EmbedIframePageContainer from "../../iframe/EmbedIframePageContainer";
import { LocaleType } from "../../interfaces";
import { MOVED_PERMANENTLY, OK } from "../../statusCodes";
import { createApolloClient } from "../../util/apiHelpers";
import { RenderFunc } from "../serverHelpers";

export const iframeEmbedRender: RenderFunc = async (req, chunks) => {
  const lang = req.params.lang ?? "";
  const htmlLang = getHtmlLang(lang);
  const locale = isValidLocale(htmlLang) ? htmlLang : undefined;
  const { embedType, embedId } = req.params;

  const noSSR = disableSSR(req);

  const initialProps = { basename: lang, embedType, embedId, locale };

  if (noSSR) {
    return {
      status: OK,
      locale: locale ?? (config.defaultLocale as LocaleType),
      data: {
        htmlContent: renderToString(
          <Document
            language={locale ?? (config.defaultLocale as LocaleType)}
            chunks={chunks}
            devEntrypoint={entryPoints.iframeEmbed}
          />,
        ),
        data: {
          config: { ...config, disableSSR: true },
          initialProps,
        },
      },
    };
  }

  const client = createApolloClient(locale, undefined, req.url);
  const i18n = initializeI18n(i18nInstance, locale ?? (config.defaultLocale as LocaleType));
  const context: RedirectInfo = {};

  const Page = (
    <Document language={locale ?? config.defaultLocale} chunks={chunks} devEntrypoint={entryPoints.iframeEmbed}>
      <RedirectContext value={context}>
        <I18nextProvider i18n={i18n}>
          <ApolloProvider client={client}>
            <StaticRouter location={req.url}>
              <EmbedIframePageContainer {...initialProps} />
            </StaticRouter>
          </ApolloProvider>
        </I18nextProvider>
      </RedirectContext>
    </Document>
  );

  const html = await renderToStringWithData(Page);

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
      htmlContent: html,
      data: {
        apolloState,
        chunks,
        config: {
          ...config,
          disableSSR: noSSR,
        },
        initialProps,
      },
    },
  };
};
