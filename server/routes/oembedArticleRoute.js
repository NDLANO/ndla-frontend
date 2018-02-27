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
import { getArticleIdFromResource } from '../../src/containers/Resources/resourceHelpers';
import { fetchResource } from '../../src/containers/Resources/resourceApi';
import { fetchArticle } from '../../src/containers/ArticlePage/articleApi';

import { articlePath } from '../../src/routes';
import config from '../../src/config';

const log = require('../../src/util/logger');

const simpleArticlePath = '/article/:articleId';

function matchUrl(pathname, isSimpleArticle, lang = false) {
  if (isSimpleArticle) {
    return {
      isSimpleArticle: true,
      ...matchPath(
        pathname,
        lang ? `/:lang${simpleArticlePath}` : simpleArticlePath,
      ),
    };
  }
  return matchPath(pathname, lang ? `/:lang${articlePath}` : articlePath);
}

export function parseAndMatchUrl(url) {
  const { pathname } = parseUrl(url);
  const paths = pathname.split('/');
  if (isValidLocale(paths[1])) {
    return matchUrl(pathname, paths[2] === 'article', true);
  }
  return matchUrl(pathname, paths[1] === 'article');
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

  const { isSimpleArticle, params: { lang = 'nb' } } = match;
  try {
    if (isSimpleArticle) {
      const { params: { articleId } } = match;
      const article = await fetchArticle(articleId, lang);
      return getOembedObject(
        req,
        article.title,
        `<iframe src="${
          config.ndlaFrontendDomain
        }/article-iframe/${lang}/article/${articleId}" frameborder="0" />`,
      );
    }

    const { params: { resourceId } } = match;
    const resource = await fetchResource(`urn:resource:${resourceId}`, lang);
    const articleId = getArticleIdFromResource(resource);

    return getOembedObject(
      req,
      resource.title,
      `<iframe src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${
        resource.id
      }/${articleId}" frameborder="0" />`,
    );
  } catch (error) {
    log.error(error);
    const status = error.status || INTERNAL_SERVER_ERROR;
    return {
      status,
      data: 'Internal server error',
    };
  }
}
