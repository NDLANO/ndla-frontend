/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../style/index.css";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { MissingRouterContext } from "@ndla/safelink";
import { i18nInstance } from "@ndla/ui";
import "@fontsource/source-sans-pro/index.css";
import "@fontsource/source-sans-pro/400-italic.css";
import "@fontsource/source-sans-pro/300.css";
import "@fontsource/source-sans-pro/300-italic.css";
import "@fontsource/source-sans-pro/600.css";
import "@fontsource/source-sans-pro/700.css";
import "@fontsource/source-code-pro/index.css";
import "@fontsource/source-code-pro/400-italic.css";
import "@fontsource/source-code-pro/700.css";
import "@fontsource/source-serif-pro/index.css";
import "@fontsource/source-serif-pro/400-italic.css";
import "@fontsource/source-serif-pro/700.css";
import IframePageContainer from "./IframePageContainer";
import { Document } from "../Document";
import { entryPoints } from "../entrypoints";
import { initializeI18n } from "../i18n";
import { renderOrHydrate } from "../renderOrHydrate";
import { createApolloClient } from "../util/apiHelpers";
import { initSentry } from "../util/sentry";

const { config, initialProps, chunks } = window.DATA;

initSentry(config);

const language = initialProps.locale ?? config.defaultLocale;

const client = createApolloClient(language);
const i18n = initializeI18n(i18nInstance, language);

renderOrHydrate(
  document,
  <Document language={language} chunks={chunks} devEntrypoint={entryPoints.iframeArticle}>
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <MissingRouterContext value={true}>
            <IframePageContainer {...initialProps} />
          </MissingRouterContext>
        </BrowserRouter>
      </ApolloProvider>
    </I18nextProvider>
  </Document>,
);
