/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import IntlProvider from 'ndla-i18n';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import ErrorPage from '../../containers/ErrorPage';
import { getLocaleInfoFromPath } from '../../i18n';
import { renderHtml, renderPage } from '../helpers/render';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST); //eslint-disable-line

async function doRenderError(req, status = INTERNAL_SERVER_ERROR) {
  const { abbreviation, messages } = getLocaleInfoFromPath(req.path);

  const context = { status };
  const Page = (
    <IntlProvider locale={abbreviation} messages={messages}>
      <ErrorPage local={abbreviation} />
    </IntlProvider>
  );

  const { html, helmet, data } = renderPage(Page);

  return {
    html,
    docProps: {
      assets: {
        css: assets.client.css ? assets.client.css : undefined,
        js: assets.injectCss ? [assets.injectCss.js] : [], // Error page is a static page, only use js to inject css under development
      },
      data,
      helmet,
    },
    context,
  };
}

export async function errorRoute(req) {
  const rendered = await doRenderError(req);
  return renderHtml(req, rendered);
}
