/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import ErrorReporter from "@ndla/error-reporter";
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
import { getCookie } from "@ndla/util";
import "../style/index.css";
import { LtiIframePage } from "./LtiIframePage";
import LtiProvider from "./LtiProvider";
import { LtiContextProvider } from "../components/LtiContext";
import { STORED_LANGUAGE_COOKIE_KEY } from "../constants";
import { initializeI18n, isValidLocale } from "../i18n";
import { createApolloClient } from "../util/apiHelpers";

const {
  DATA: { initialProps, config },
} = window;

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
  ignoreUrls: [],
});

const storedLanguage = getCookie(STORED_LANGUAGE_COOKIE_KEY, document.cookie);
const language = isValidLocale(storedLanguage) ? storedLanguage : config.defaultLocale;
const client = createApolloClient(language);
const i18n = initializeI18n(i18nInstance, language);

const root = createRoot(document.getElementById("root")!);
root.render(
  <HelmetProvider>
    <LtiContextProvider ltiData={initialProps.ltiData}>
      <I18nextProvider i18n={i18n}>
        <ApolloProvider client={client}>
          <MemoryRouter initialEntries={["/lti"]} basename="/">
            <Routes>
              <Route path="lti" element={<LtiProvider />} />
              <Route path="article-iframe" element={<LtiIframePage />}>
                <Route path="article/:articleId" element={null} />
                <Route path=":lang/article/:articleId" element={null} />
                <Route path=":taxonomyId/:articleId" element={null} />
                <Route path=":lang/:taxonomyId/:articleId" element={null} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ApolloProvider>
      </I18nextProvider>
    </LtiContextProvider>
  </HelmetProvider>,
);
