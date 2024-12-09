/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { StaticRouter } from "react-router-dom/server";
import { MissingRouterContext } from "@ndla/safelink";
import { i18nInstance } from "@ndla/ui";
import { RedirectInfo } from "../../components/RedirectContext";
import Scripts from "../../components/Scripts/Scripts";
import config from "../../config";
import ErrorPage from "../../containers/ErrorPage";
import { getHtmlLang, getLocaleObject } from "../../i18n";
import { MOVED_PERMANENTLY, OK } from "../../statusCodes";
import { RenderFunc } from "../serverHelpers";

export const errorRender: RenderFunc = async (req) => {
  const context: RedirectInfo = {};

  const lang = getHtmlLang(req.params.lang ?? "");
  const locale = getLocaleObject(lang).abbreviation;

  const Page = (
    <I18nextProvider i18n={i18nInstance}>
      <MissingRouterContext.Provider value={true}>
        <StaticRouter location={req.url}>
          <Scripts />
          <ErrorPage />
        </StaticRouter>
      </MissingRouterContext.Provider>
    </I18nextProvider>
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
        serverPath: req.path,
        serverQuery: req.query,
        config: {
          ...config,
        },
      },
    },
  };
};
