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
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { resetIdCounter } from 'ndla-tabs';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status';

import { getHtmlLang, getLocaleObject } from '../../i18n';
import Document from '../helpers/Document';
import { fetchArticle } from '../../containers/ArticlePage/articleApi';
import { fetchResourceTypesForResource } from '../../containers/Resources/resourceApi';
import IframeArticlePage from '../../iframe/IframeArticlePage';
import config from '../../config';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST); //eslint-disable-line
const log = require('../../util/logger');

if (process.env.NODE_ENV === 'unittest') {
  Helmet.canUseDOM = false;
}

const getAssets = () => ({
  css: assets.client.css,
  js: [assets.embed.js],
});

const renderPage = initialProps => {
  resetIdCounter();
  const html = config.disableSSR
    ? ''
    : renderToString(<IframeArticlePage {...initialProps} />);
  const helmet = Helmet.renderStatic();
  return {
    html,
    helmet,
    assets: getAssets(),
    data: {
      assets,
      initialProps,
      config,
    },
  };
};

export async function iframeArticleRoute(req) {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const locale = getLocaleObject(lang);
  const { articleId, resourceId } = req.params;

  try {
    const article = await fetchArticle(articleId, lang);
    const resourceTypes = await fetchResourceTypesForResource(resourceId, lang);

    const { html, ...docProps } = renderPage({
      article: { ...article, resourceTypes },
      locale,
      status: 'success',
    });
    const doc = renderToStaticMarkup(<Document {...docProps} />);

    return {
      status: OK,
      data: `<!doctype html>${doc.replace('REPLACE_ME', html)}`,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'unittest') {
      // skip log in unittests
      log.error(error);
    }
    const { html, ...docProps } = renderPage({
      locale,
      status: 'error',
    });
    const doc = renderToStaticMarkup(<Document {...docProps} />);
    return {
      status: error.status || INTERNAL_SERVER_ERROR,
      data: `<!doctype html>${doc.replace('REPLACE_ME', html)}`,
    };
  }
}
