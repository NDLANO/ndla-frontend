/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import Helmet from 'react-helmet';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { getHtmlLang, getLocaleObject } from '../../i18n';
import handleError from '../../util/handleError';
import { renderPage, renderHtml } from '../helpers/render';

const assets =
  process.env.NODE_ENV !== 'unittest'
    ? require(process.env.RAZZLE_ASSETS_MANIFEST) //eslint-disable-line
    : {
        client: { css: 'mock.css' },
        embed: { js: 'mock.js' },
        mathJaxConfig: { js: 'mock.js' },
      };

if (process.env.NODE_ENV === 'unittest') {
  Helmet.canUseDOM = false;
}

const getAssets = () => ({
  css: assets.client.css,
  js: [assets.ltiEmbed.js],
  mathJaxConfig: { js: assets.mathJaxConfig.js },
});

function doRenderPage(initialProps) {
  const Page = '';
  const { html, ...docProps } = renderPage(Page, getAssets(), {
    initialProps,
  });
  return { html, docProps: { ...docProps, useZendesk: false } };
}

export async function ltiRoute(req) {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const locale = getLocaleObject(lang);
  console.log(locale);
  try {
    const { html, docProps } = doRenderPage({
      locale,
      status: 'success',
    });

    return renderHtml(req, html, { status: OK }, docProps);
  } catch (error) {
    if (process.env.NODE_ENV !== 'unittest') {
      // skip log in unittests
      handleError(error);
    }
    const { html, docProps } = doRenderPage({
      locale,
      status: 'error',
    });

    const status = error.status || INTERNAL_SERVER_ERROR;
    return renderHtml(req, html, { status }, docProps);
  }
}
