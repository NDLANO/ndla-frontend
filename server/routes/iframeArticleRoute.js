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

import { getHtmlLang, getLocaleObject } from '../../src/i18n';
import Document from '../helpers/Document';
import { fetchArticle } from '../../src/containers/ArticlePage/articleApi';
import { fetchResourceTypesForResource } from '../../src/containers/Resources/resourceApi';
import IframeArticlePage from '../../src/iframe/IframeArticlePage';
import config from '../../src/config';

// Because JSDom exists, ExecutionEnvironment assumes that we're on the client.
if (process.env.NODE_ENV === 'unittest') {
  Helmet.canUseDOM = false;
}

const assets = config.isProduction
  ? require('../../assets/assets') // eslint-disable-line import/no-unresolved
  : require('../developmentAssets');

const getAssets = () => ({
  favicon: `/assets/${assets['ndla-favicon.png']}`,
  css: config.isProduction ? `/assets/${assets['main.css']}` : undefined,
  js: [`/assets/${assets['manifest.js']}`, `/assets/${assets['embed.js']}`],
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
    const resourceTypes = await fetchResourceTypesForResource(
      `urn:resource:${resourceId}`,
      lang,
    );

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
      console.error(error);
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
