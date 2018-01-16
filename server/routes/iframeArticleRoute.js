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

import { getHtmlLang, getLocaleObject } from '../../src/i18n';
import Document from '../helpers/Document';
import { fetchArticle } from '../../src/containers/ArticlePage/articleApi';
import { storeAccessToken } from '../../src/util/apiHelpers';
import IframeArticlePage from '../../src/iframe/IframeArticlePage';
import config from '../../src/config';

const assets = config.isProduction
  ? require('../../assets/assets') // eslint-disable-line import/no-unresolved
  : require('../developmentAssets');

const getAssets = () => ({
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

export async function iframeArticleRoute(req, res, token) {
  storeAccessToken(token.access_token);
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const locale = getLocaleObject(lang);
  const articleId = req.params.id;

  try {
    const article = await fetchArticle(articleId, lang);

    const { html, ...docProps } = renderPage({
      article,
      locale,
      status: 'success',
    });
    const doc = renderToStaticMarkup(<Document {...docProps} />);

    res.send(`<!doctype html>${doc.replace('REPLACE_ME', html)}`);
    res.end();
  } catch (error) {
    console.log(error);
    const { html, ...docProps } = renderPage({
      locale,
      status: 'error',
    });
    const doc = renderToStaticMarkup(<Document {...docProps} />);
    res
      .status(error.status || 503)
      .send(`<!doctype html>${doc.replace('REPLACE_ME', html)}`);
  }
}
