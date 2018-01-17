/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath } from 'react-router-dom';
import parseUrl from 'parse-url';
import { isValidLocale } from '../../src/i18n';
import { fetchArticle } from '../../src/containers/ArticlePage/articleApi';
import { articlePath } from '../../src/routes';
import config from '../../src/config';

export function parseAndMatchUrl(url) {
  const { pathname } = parseUrl(url);
  const paths = pathname.split('/');
  if (isValidLocale(paths[1])) {
    return matchPath(pathname, `/:lang${articlePath}`);
  }
  return matchPath(pathname, articlePath);
}

export async function oembedArticleRoute(req, res) {
  const { url } = req.query;
  if (!url) {
    res
      .status(400)
      .json({ status: 404, text: 'Bad request. Missing url param.' });
    return;
  }

  const match = parseAndMatchUrl(url);

  if (!match) {
    res.status(400).json({ status: 400, text: 'Bad request. Invalid url.' });
    return;
  }

  const {
    params: { articleId, plainResourceId: resourceId, lang = 'nb' },
  } = match;

  try {
    const article = await fetchArticle(articleId, lang);

    res.json({
      type: 'rich',
      version: '1.0', // oEmbed version
      height: req.query.height ? req.query.height : 800,
      width: req.query.width ? req.query.width : 800,
      title: article.title,
      html: `<iframe src="${
        config.ndlaFrontendDomain
      }/article-iframe/${lang}/${resourceId}/${articleId}" frameborder="0" />`,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 503).json('Internal server error');
  }
}
