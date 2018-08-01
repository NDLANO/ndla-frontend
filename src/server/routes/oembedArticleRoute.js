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
import { isValidLocale } from '../../i18n';
import { getArticleIdFromResource } from '../../containers/Resources/resourceHelpers';
import { fetchResource } from '../../containers/Resources/resourceApi';
import { articlePath, simpleArticlePath } from '../../routes';
import config from '../../config';
import handleError from '../../util/handleError';
import { fetchArticle } from '../../containers/ArticlePage/articleApi';

export function matchUrl(pathname, isPlainArticle, lang = false) {
  if (isPlainArticle) {
    return matchPath(
      pathname,
      lang ? `/:lang${simpleArticlePath}` : simpleArticlePath,
    );
  }
  return matchPath(pathname, lang ? `/:lang${articlePath}` : articlePath);
}

export function parseAndMatchUrl(url) {
  const { pathname } = parseUrl(url);
  const paths = pathname.split('/');
  paths[1] = paths[1] === 'unknown' ? 'nb' : paths[1];
  const path = paths.join('/');

  if (isValidLocale(paths[1])) {
    return matchUrl(path, paths[2] === 'article', true);
  }
  return matchUrl(path, paths[1] === 'article', false);
}

function getOembedObject(req, title, html) {
  return {
    data: {
      type: 'rich',
      version: '1.0', // oEmbed version
      height: req.query.height ? req.query.height : 800,
      width: req.query.width ? req.query.width : 800,
      title,
      html,
    },
  };
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
    params: { resourceId, lang = 'nb' },
  } = match;
  try {
    if (!resourceId) {
      const {
        params: { articleId },
      } = match;
      const article = await fetchArticle(articleId, lang);
      return getOembedObject(
        req,
        article.title,
        `<iframe src="${
          config.ndlaFrontendDomain
        }/article-iframe/${lang}/article/${articleId}" frameborder="0" allowFullscreen="" />`,
      );
    }

    const resource = await fetchResource(`urn:resource:${resourceId}`, lang);
    const articleId = getArticleIdFromResource(resource);

    return getOembedObject(
      req,
      resource.title,
      `<iframe src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${
        resource.id
      }/${articleId}" frameborder="0" allowFullscreen="" />`,
    );
  } catch (error) {
    handleError(error);
    const status = error.status || INTERNAL_SERVER_ERROR;
    return {
      status,
      data: 'Internal server error',
    };
  }
}
