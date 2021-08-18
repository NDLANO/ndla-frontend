/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import IntlProvider from '@ndla/i18n';
import { MissingRouterContext } from '@ndla/safelink';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import ErrorPage from '../../containers/ErrorPage';
import { getLocaleInfoFromPath } from '../../i18n';
import { renderHtml, renderPage } from '../helpers/render';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST); //eslint-disable-line

const getAssets = () => ({
  css: assets.client.css ? assets.client.css : undefined,
  // Error page is a static page, only use js to inject css under development
  js: assets.injectCss ? [{ src: assets.injectCss.js }] : [],
});

async function doRenderError(req, status = INTERNAL_SERVER_ERROR) {
  const { abbreviation, messages } = getLocaleInfoFromPath(req.path);
  const context = { status };
  const Page = (
    <IntlProvider locale={abbreviation} messages={messages}>
      <MissingRouterContext.Provider value={true}>
        <ErrorPage locale={abbreviation} />
      </MissingRouterContext.Provider>
    </IntlProvider>
  );

  const { html, ...docProps } = renderPage(Page, getAssets());

  return {
    html,
    docProps,
    context,
  };
}

export async function errorRoute(req) {
  const { html, context, docProps } = await doRenderError(req);
  return renderHtml(req, html, context, docProps);
}
