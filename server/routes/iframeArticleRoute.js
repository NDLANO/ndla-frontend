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

import { htmlErrorTemplate } from '../helpers/oembedHtmlTemplate';
import Document from '../helpers/Document';
import { fetchArticle } from '../../src/containers/ArticlePage/articleApi';
import { storeAccessToken } from '../../src/util/apiHelpers';
import OembedPage from '../../src/oembed/OembedPage';
import config from '../../src/config';

const assets = config.isProduction
  ? require('../../assets/assets') // eslint-disable-line import/no-unresolved
  : require('../developmentAssets');

const getAssets = () => ({
  css: config.isProduction ? `/assets/${assets['main.css']}` : undefined,
  js: [`/assets/${assets['manifest.js']}`, `/assets/${assets['embed.js']}`],
});

export async function iframeArticleRoute(req, res, token) {
  storeAccessToken(token.access_token);
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const locale = getLocaleObject(lang);
  const articleId = req.params.id;

  try {
    const article = await fetchArticle(articleId, lang);

    const renderPage = () => {
      resetIdCounter();
      const html = renderToString(
        <OembedPage article={article} locale={locale} />,
      );
      const helmet = Helmet.renderStatic();
      return { html, helmet };
    };

    const { html, ...docProps } = await Document.getInitialProps({
      req,
      res,
      lang,
      assets: getAssets(),
      renderPage,
      data: { lang, locale, article, config },
    });
    const doc = renderToStaticMarkup(<Document {...docProps} />);

    res.send(`<!doctype html>${doc.replace('REPLACE_ME', html)}`);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(error.status).send(htmlErrorTemplate(lang, error));
  }
}
