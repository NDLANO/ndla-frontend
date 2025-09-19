/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { createMemoryRouter, RouterProvider } from "react-router";
import { ApolloProvider } from "@apollo/client";
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
import "../style/index.css";
import { LtiContextProvider } from "../components/LtiContext";
import { Document } from "../Document";
import { entryPoints } from "../entrypoints";
import { initializeI18n } from "../i18n";
import { routes } from "./routes";
import { createApolloClient } from "../util/apiHelpers";
import { initSentry } from "../util/sentry";

const {
  DATA: { initialProps, config, chunks, hash },
} = window;

initSentry(config);

const language = config.defaultLocale;
const client = createApolloClient(language);
const i18n = initializeI18n(language, hash);

const router = createMemoryRouter(routes);

const root = createRoot(document);
root.render(
  <Document language={language} devEntrypoint={entryPoints.lti} chunks={chunks} hash={hash}>
    <LtiContextProvider ltiData={initialProps.ltiData}>
      <I18nextProvider i18n={i18n}>
        <ApolloProvider client={client}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </I18nextProvider>
    </LtiContextProvider>
  </Document>,
);
