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
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { MissingRouterContext } from "@ndla/safelink";
import { i18nInstance } from "@ndla/ui";
import { getCookie, setCookie } from "@ndla/util";
import ErrorPage from "./ErrorPage";
import Scripts from "../../components/Scripts/Scripts";
import { SiteThemeProvider } from "../../components/SiteThemeContext";
import { STORED_LANGUAGE_COOKIE_KEY } from "../../constants";
import { Document } from "../../Document";
import { entryPoints } from "../../entrypoints";
import { getLocaleInfoFromPath, initializeI18n } from "../../i18n";
import { initSentry } from "../../util/sentry";

const { config, serverPath, chunks } = window.DATA;

initSentry(config);

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

const renderOrHydrate = (container: Document | Element, children: ReactNode) => {
  if (config.disableSSR) {
    const root = createRoot(container);
    root.render(children);
  } else {
    hydrateRoot(container, children);
  }
};

renderOrHydrate(
  document,
  <Document language={storedLanguage} chunks={chunks} devEntrypoint={entryPoints.error}>
    <I18nextProvider i18n={i18n}>
      <SiteThemeProvider value={window.DATA.siteTheme}>
        <BrowserRouter>
          <MissingRouterContext.Provider value={true}>
            <Scripts />
            <ErrorPage />
          </MissingRouterContext.Provider>
        </BrowserRouter>
      </SiteThemeProvider>
    </I18nextProvider>
  </Document>,
);
