/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../../style/index.css";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { MissingRouterContext } from "@ndla/safelink";
import { i18nInstance } from "@ndla/ui";
import ErrorPage from "./ErrorPage";
import Scripts from "../../components/Scripts/Scripts";
import { SiteThemeProvider } from "../../components/SiteThemeContext";
import { Document } from "../../Document";
import { entryPoints } from "../../entrypoints";
import { getLocaleInfoFromPath, initializeI18n } from "../../i18n";
import { renderOrHydrate } from "../../renderOrHydrate";
import { initSentry } from "../../util/sentry";

const { config, serverPath, chunks } = window.DATA;

initSentry(config);

const { abbreviation } = getLocaleInfoFromPath(serverPath ?? "");
const i18n = initializeI18n(i18nInstance, abbreviation);

renderOrHydrate(
  document,
  <Document language={abbreviation} chunks={chunks} devEntrypoint={entryPoints.error}>
    <I18nextProvider i18n={i18n}>
      <SiteThemeProvider value={window.DATA.siteTheme}>
        <BrowserRouter>
          <MissingRouterContext value={true}>
            <Scripts />
            <ErrorPage />
          </MissingRouterContext>
        </BrowserRouter>
      </SiteThemeProvider>
    </I18nextProvider>
  </Document>,
);
