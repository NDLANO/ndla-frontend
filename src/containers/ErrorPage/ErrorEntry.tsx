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
import { getCookie, setCookie } from "@ndla/util";
import ErrorPage from "./ErrorPage";
import Scripts from "../../components/Scripts/Scripts";
import { STORED_LANGUAGE_COOKIE_KEY } from "../../constants";
import { getLocaleInfoFromPath, initializeI18n } from "../../i18n";

const { config, serverPath } = window.DATA;

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
});

const { abbreviation } = getLocaleInfoFromPath(serverPath ?? "");

const maybeStoredLanguage = getCookie(STORED_LANGUAGE_COOKIE_KEY, document.cookie);
// Set storedLanguage to a sane value if non-existent
if (maybeStoredLanguage === null || maybeStoredLanguage === undefined) {
  setCookie({
    cookieName: STORED_LANGUAGE_COOKIE_KEY,
    cookieValue: abbreviation,
    lax: true,
  });
}
const storedLanguage = getCookie(STORED_LANGUAGE_COOKIE_KEY, document.cookie)!;

const i18n = initializeI18n(i18nInstance, storedLanguage);

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
