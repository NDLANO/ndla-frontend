/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import defined from 'defined';
import Helmet from 'react-helmet';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';

import { getHtmlLang, getLocaleObject } from '../../i18n';
import { fetchArticle } from '../../containers/ArticlePage/articleApi';
import { fetchResourceTypesForResource } from '../../containers/Resources/resourceApi';
import IframePage from '../../iframe/IframePage';
import config from '../../config';
import handleError from '../../util/handleError';
import { renderPage, renderHtml } from '../helpers/render';

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

function doRenderPage(initialProps) {
  const Page = config.disableSSR ? '' : <IframePage {...initialProps} />;
  const { html, ...docProps } = renderPage(Page, getAssets(), {
    initialProps,
  });
  return { html, docProps };
}

export async function iframeArticleRoute(req) {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const removeRelatedContent = defined(req.query.removeRelatedContent, false);
  const locale = getLocaleObject(lang);
  const { articleId, taxonomyId } = req.params;
  const location = { pathname: req.url };
  try {
    if (taxonomyId.startsWith('urn:topic')) {
      const article = await fetchArticle(articleId, lang, removeRelatedContent);
      const { html, docProps } = doRenderPage({
        locale,
        article,
        isTopicArticle: true,
        status: 'success',
        location,
      });

      return renderHtml(req, html, { status: OK }, docProps);
    }
    const article = await fetchArticle(articleId, lang, removeRelatedContent);
    const resourceTypes = await fetchResourceTypesForResource(taxonomyId, lang);
    const { html, docProps } = doRenderPage({
      resource: { article, resourceTypes },
      locale,
      status: 'success',
      location,
    });

    return renderHtml(req, html, { status: OK }, docProps);
  } catch (error) {
    if (process.env.NODE_ENV !== 'unittest') {
      // skip log in unittests
      handleError(error);
    }
    const { html, docProps } = doRenderPage({
      locale,
      location,
      status: 'error',
    });

    const status = error.status || INTERNAL_SERVER_ERROR;
    return renderHtml(req, html, { status }, docProps);
  }
}
