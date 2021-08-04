/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import express from 'express';
import { match as RouterMatchType } from 'react-router';
import { getArticleIdFromResource } from '../../containers/Resources/resourceHelpers';
import {
  fetchResource,
  fetchTopic,
} from '../../containers/Resources/resourceApi';
import config from '../../config';
import handleError from '../../util/handleError';
import { fetchArticle } from '../../containers/ArticlePage/articleApi';
import { parseAndMatchUrl } from '../../util/urlHelper';

function getOembedObject(req: express.Request, title?: string, html?: string) {
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

interface MatchParams {
  resourceId?: string;
  topicId?: string;
  lang?: string;
  articleId?: string;
}
const getHTMLandTitle = async (match: RouterMatchType<MatchParams>) => {
  const {
    params: { resourceId, topicId, lang = 'nb' },
  } = match;
  if (!topicId && !resourceId) {
    return {};
  }
  if (topicId && !resourceId) {
    const topic = await fetchTopic(`urn:${topicId}`, lang);
    const articleId = getArticleIdFromResource(topic);
    return {
      title: topic.name,
      html: `<iframe aria-label="${topic.name}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${topic.id}/${articleId}" frameborder="0" allowFullscreen="" />`,
    };
  }

  const resource = await fetchResource(`urn:resource:${resourceId}`, lang);
  const articleId = getArticleIdFromResource(resource);
  return {
    title: resource.name,
    html: `<iframe aria-label="${resource.name}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${resource.id}/${articleId}" frameborder="0" allowFullscreen="" />`,
  };
};

export async function oembedArticleRoute(req: express.Request) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return {
      status: BAD_REQUEST,
      data: 'Bad request. Missing url param.',
    };
  }

  const match = parseAndMatchUrl<MatchParams>(url);
  if (!match) {
    return {
      status: BAD_REQUEST,
      data: 'Bad request. Invalid url.',
    };
  }

  const {
    params: { resourceId, topicId, lang = 'nb' },
  } = match;
  try {
    if (!resourceId && !topicId) {
      const {
        params: { articleId },
      } = match;
      const article = await fetchArticle(articleId, lang);
      return getOembedObject(
        req,
        article.title,
        `<iframe aria-label="${article.title}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/article/${articleId}" frameborder="0" allowFullscreen="" />`,
      );
    }
    const { html, title } = await getHTMLandTitle(match);
    return getOembedObject(req, title, html);
  } catch (error) {
    handleError(error);
    const status = error.status || INTERNAL_SERVER_ERROR;
    return {
      status,
      data: 'Internal server error',
    };
  }
}
