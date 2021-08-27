/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';

import { getHtmlLang } from '../../i18n';
import IframePageContainer from '../../iframe/IframePageContainer';
import config from '../../config';
import handleError from '../../util/handleError';
import { renderPageWithData, renderHtml } from '../helpers/render';

const assets =
  process.env.NODE_ENV !== 'unittest'
    ? require(process.env.RAZZLE_ASSETS_MANIFEST) //eslint-disable-line
    : {
        client: { css: 'mock.css' },
        embed: { js: 'mock.js' },
        polyfill: { js: 'mock.js' },
        mathJaxConfig: { js: 'mock.js' },
      };

if (process.env.NODE_ENV === 'unittest') {
  Helmet.canUseDOM = false;
}

const getAssets = () => ({
  css: assets.client.css,
  js: [{ src: assets.embed.js }],
  polyfill: { src: assets.polyfill.js },
  mathJaxConfig: { js: assets.mathJaxConfig.js },
});

async function doRenderPage(initialProps) {
  const Page = config.disableSSR ? (
    ''
  ) : (
    <IframePageContainer {...initialProps} />
  );
  const { html, ...docProps } = await renderPageWithData(Page, getAssets(), {
    initialProps,
  });
  return { html, docProps };
}

export async function iframeArticleRoute(req) {
  const lang = req.params.lang ?? '';
  const locale = getHtmlLang(lang);
  const { articleId, taxonomyId } = req.params;
  const location = { pathname: req.url, search: '', hash: '' };
  try {
    const { html, docProps } = await doRenderPage({
      articleId,
      taxonomyId,
      isOembed: 'true',
      isTopicArticle: taxonomyId?.startsWith('urn:topic') || false,
      basename: lang,
      locale,
      location,
      status: 'success',
    });

    return renderHtml(req, html, { status: OK }, docProps);
  } catch (error) {
    if (process.env.NODE_ENV !== 'unittest') {
      // skip log in unittests
      handleError(error);
    }
    const { html, docProps } = await doRenderPage({
      basename: lang,
      locale,
      location,
      status: 'error',
    });

    const status = error.status || INTERNAL_SERVER_ERROR;
    return renderHtml(req, html, { status }, docProps);
  }
}
