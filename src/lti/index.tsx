/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloProvider } from "@apollo/client/react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { createMemoryRouter, RouterProvider } from "react-router";
import "../style/index.css";
import { LtiContextProvider } from "../components/LtiContext";
import { RestrictedModeProvider } from "../components/RestrictedModeContext";
import { Document } from "../Document";
import { initializeI18n } from "../i18n";
import { createApolloClient } from "../util/apiHelpers";
import { initSentry } from "../util/sentry";
import { routes } from "./routes";

const {
  DATA: { initialProps, config, chunkInfo, hash, restrictedMode },
} = window;

initSentry(config);

const language = config.defaultLocale;
const client = createApolloClient(language);
const i18n = initializeI18n(language, hash);

const router = createMemoryRouter(routes);

const root = createRoot(document);
root.render(
  <Document language={language} chunkInfo={chunkInfo} hash={hash}>
    <RestrictedModeProvider value={restrictedMode}>
      <LtiContextProvider ltiData={initialProps.ltiData}>
        <I18nextProvider i18n={i18n}>
          <ApolloProvider client={client}>
            <RouterProvider router={router} />
          </ApolloProvider>
        </I18nextProvider>
      </LtiContextProvider>
    </RestrictedModeProvider>
  </Document>,
);
