/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath } from 'react-router-dom';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
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

export async function oembedArticleRoute(req) {
  const { url } = req.query;
  if (!url) {
    return {
      status: BAD_REQUEST,
      data: 'Bad request. Missing url param.',
    };
  }

  const match = parseAndMatchUrl(url);

  if (!match) {
    return {
      status: BAD_REQUEST,
      data: 'Bad request. Invalid url.',
    };
  }

  const {
    params: { articleId, plainResourceId: resourceId, lang = 'nb' },
  } = match;

  try {
    const article = await fetchArticle(articleId, lang);
    return {
      data: {
        type: 'rich',
        version: '1.0', // oEmbed version
        height: req.query.height ? req.query.height : 800,
        width: req.query.width ? req.query.width : 800,
        title: article.title,
        html: `<iframe src="${
          config.ndlaFrontendDomain
        }/article-iframe/${lang}/${resourceId}/${articleId}" frameborder="0" />`,
      },
    };
  } catch (error) {
    console.error(error);
    const status = error.status || INTERNAL_SERVER_ERROR;
    return {
      status,
      data: 'Internal server error',
    };
  }
}
