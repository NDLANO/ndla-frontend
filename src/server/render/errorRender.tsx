/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom";
import { MissingRouterContext } from "@ndla/safelink";
import { errorRoutes } from "../../appRoutes";
import { RedirectInfo } from "../../components/RedirectContext";
import { SiteThemeProvider } from "../../components/SiteThemeContext";
import config from "../../config";
import { Document } from "../../Document";
import { entryPoints } from "../../entrypoints";
import { getHtmlLang, getLocaleInfoFromPath, getLocaleObject } from "../../i18n";
import { MOVED_PERMANENTLY, OK } from "../../statusCodes";
import { getSiteTheme } from "../../util/siteTheme";
import { initializeI18n } from "../locales/locales";
import { createFetchRequest } from "../request";
import { RenderFunc } from "../serverHelpers";

const { query, dataRoutes } = createStaticHandler(errorRoutes);

export const errorRender: RenderFunc = async (req, chunks) => {
  const context: RedirectInfo = {};

  const lang = getHtmlLang(req.params.lang ?? "");
  const locale = getLocaleObject(lang).abbreviation;
  const siteTheme = getSiteTheme();
  const { abbreviation } = getLocaleInfoFromPath(req.path ?? "");
  const i18n = initializeI18n(abbreviation);

  const fetchRequest = createFetchRequest(req);
  const routerContext = await query(fetchRequest);

  if (routerContext instanceof Response) {
    throw routerContext;
  }

  const router = createStaticRouter(dataRoutes, routerContext);

  const Page = (
    <Document language={locale} chunks={chunks} devEntrypoint={entryPoints.error}>
      <I18nextProvider i18n={i18n}>
        <MissingRouterContext value={true}>
          <SiteThemeProvider value={siteTheme}>
            <StaticRouterProvider router={router} context={routerContext} hydrate={false} />
          </SiteThemeProvider>
        </MissingRouterContext>
      </I18nextProvider>
    </Document>
  );

  const html = renderToString(Page);

  if (context.url) {
    return {
      status: context.status || MOVED_PERMANENTLY,
      location: context.url,
    };
  }

  return {
    status: context.status || OK,
    locale,
    data: {
      htmlContent: html,
      data: {
        chunks,
        siteTheme,
        serverPath: req.path,
        serverQuery: req.query,
        config: {
          ...config,
        },
      },
    },
  };
};
