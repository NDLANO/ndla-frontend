/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../../style/index.css";
import { ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { ErrorReporter } from "@ndla/error-reporter";
import { MissingRouterContext } from "@ndla/safelink";
import { i18nInstance } from "@ndla/ui";
import ErrorPage from "./ErrorPage";
import Scripts from "../../components/Scripts/Scripts";
import { getLocaleInfoFromPath, initializeI18n, isValidLocale } from "../../i18n";

const { config, serverPath } = window.DATA;

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
});

const { abbreviation } = getLocaleInfoFromPath(serverPath ?? "");

const lang = isValidLocale(abbreviation) ? abbreviation : undefined;

const i18n = initializeI18n(i18nInstance, lang ?? config.defaultLocale);

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
    <BrowserRouter>
      <MissingRouterContext.Provider value={true}>
        <HelmetProvider>
          <Scripts />
          <ErrorPage />
        </HelmetProvider>
      </MissingRouterContext.Provider>
    </BrowserRouter>
  </I18nextProvider>,
);
