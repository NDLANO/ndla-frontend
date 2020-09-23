/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import { getArticleIdFromResource } from '../../containers/Resources/resourceHelpers';
import {
  fetchResource,
  fetchTopic,
} from '../../containers/Resources/resourceApi';
import config from '../../config';
import handleError from '../../util/handleError';
import { fetchArticle } from '../../containers/ArticlePage/articleApi';
import { parseAndMatchUrl } from '../../util/urlHelper';

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

const getHTMLandTitle = async match => {
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
      html: `<iframe aria-label="${topic.name}" src="${config.ndlaFrontendDomain}/article-iframe/${topic.id}/${articleId}?removeRelatedContent=true" frameborder="0" allowFullscreen="" />`,
    };
  }

  const resource = await fetchResource(`urn:resource:${resourceId}`, lang);
  const articleId = getArticleIdFromResource(resource);
  return {
    title: resource.name,
    html: `<iframe aria-label="${resource.name}" src="${config.ndlaFrontendDomain}/article-iframe/${resource.id}/${articleId}?removeRelatedContent=true" frameborder="0" allowFullscreen="" />`,
  };
};

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
        `<iframe aria-label="${article.title}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/article/${articleId}?removeRelatedContent=true" frameborder="0" allowFullscreen="" />`,
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
