/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../../style/index.css";
import { I18nextProvider } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router";
import { MissingRouterContext } from "@ndla/safelink";
import { errorRoutes } from "../../appRoutes";
import { RestrictedModeProvider } from "../../components/RestrictedModeContext";
import { SiteThemeProvider } from "../../components/SiteThemeContext";
import { Document } from "../../Document";
import { getLocaleInfoFromPath, initializeI18n } from "../../i18n";
import { renderOrHydrate } from "../../util/renderOrHydrate";
import { initSentry } from "../../util/sentry";

const { config, serverPath, chunkInfo, hash, restrictedMode } = window.DATA;

initSentry(config);

const { abbreviation, basepath } = getLocaleInfoFromPath(serverPath ?? "");
const i18n = initializeI18n(abbreviation, hash);

const router = createBrowserRouter(errorRoutes);

renderOrHydrate(
  document,
  <Document language={abbreviation} chunkInfo={chunkInfo} hash={hash}>
    <RestrictedModeProvider value={restrictedMode}>
      <I18nextProvider i18n={i18n}>
        <MissingRouterContext value={true}>
          <SiteThemeProvider value={window.DATA.siteTheme}>
            <RouterProvider router={router} />
          </SiteThemeProvider>
        </MissingRouterContext>
      </I18nextProvider>
    </RestrictedModeProvider>
  </Document>,
  errorRoutes,
  basepath,
);
