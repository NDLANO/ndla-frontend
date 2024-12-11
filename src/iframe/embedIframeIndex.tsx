/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../style/index.css";
import { ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
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
import EmbedIframePageContainer from "./EmbedIframePageContainer";
import { initializeI18n } from "../i18n";
import { LocaleType, LtiData } from "../interfaces";
import { createApolloClient } from "../util/apiHelpers";
import { initSentry } from "../util/sentry";

type EmbedInitialProps = {
  embedId?: string;
  embedType?: string;
  isOembed?: string;
  status?: "success" | "error";
  loading?: boolean;
  basename?: string;
  locale?: LocaleType;
  ltiData?: LtiData;
};

const { config, initialProps } = window.DATA;

initSentry(config);

const language = initialProps.locale ?? config.defaultLocale;

const client = createApolloClient(language, undefined, window.location.pathname);
const i18n = initializeI18n(i18nInstance, language);

const renderOrHydrate = (container: HTMLElement, children: ReactNode) => {
  if (config.disableSSR) {
    const root = createRoot(container);
    root.render(children);
  } else {
    hydrateRoot(container, children);
  }
};
renderOrHydrate(
  document.getElementById("root")!,
  <I18nextProvider i18n={i18n}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MissingRouterContext.Provider value={true}>
          <EmbedIframePageContainer {...(initialProps as EmbedInitialProps)} />
        </MissingRouterContext.Provider>
      </BrowserRouter>
    </ApolloProvider>
  </I18nextProvider>,
);
