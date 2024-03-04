/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { MissingRouterContext } from "@ndla/safelink";
import { i18nInstance } from "@ndla/ui";
import { RedirectInfo } from "../../components/RedirectContext";
import Scripts from "../../components/Scripts/Scripts";
import config from "../../config";
import ErrorPage from "../../containers/ErrorPage";
import { MOVED_PERMANENTLY, OK } from "../../statusCodes";
import { RenderFunc } from "../serverHelpers";

export const errorRender: RenderFunc = async (req) => {
  const context: RedirectInfo = {};
  //@ts-ignore
  const helmetContext: FilledContext = {};

  const Page = (
    <I18nextProvider i18n={i18nInstance}>
      <MissingRouterContext.Provider value={true}>
        <HelmetProvider context={helmetContext}>
          <Scripts />
          <ErrorPage />
        </HelmetProvider>
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
    data: {
      helmetContext,
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
