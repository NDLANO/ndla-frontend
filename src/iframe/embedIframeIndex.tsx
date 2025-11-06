/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../style/index.css";
import { I18nextProvider } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ApolloProvider } from "@apollo/client/react";
import { MissingRouterContext } from "@ndla/safelink";
import { Document } from "../Document";
import { entryPoints } from "../entrypoints";
import { initializeI18n } from "../i18n";
import { iframeEmbedRoutes } from "./embedIframeRoutes";
import { createApolloClient } from "../util/apiHelpers";
import { renderOrHydrate } from "../util/renderOrHydrate";
import { initSentry } from "../util/sentry";

const { config, initialProps, chunkInfo, hash } = window.DATA;

initSentry(config);

const language = initialProps.locale ?? config.defaultLocale;

const client = createApolloClient(language, undefined);
const i18n = initializeI18n(language, hash);

const router = createBrowserRouter(iframeEmbedRoutes);

renderOrHydrate(
  document,
  <Document language={language} chunkInfo={chunkInfo} devEntrypoint={entryPoints.iframeEmbed} hash={hash}>
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={client}>
        <MissingRouterContext value={true}>
          <RouterProvider router={router} />
        </MissingRouterContext>
      </ApolloProvider>
    </I18nextProvider>
  </Document>,
  iframeEmbedRoutes,
);
