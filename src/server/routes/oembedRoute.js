/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import {
  getIdFromResourceContentUri,
  isLearningPathResource,
} from '../../containers/Resources/resourceHelpers';
import { fetchResource } from '../../containers/Resources/resourceApi';
import config from '../../config';
import handleError from '../../util/handleError';
import { parseAndMatchUrl } from '../../util/urlHelper';
import { fetchArticle } from '../../containers/ArticlePage/articleApi';
import { fetchLearningpath } from '../../containers/LearningpathPage/learningpathApi';

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

export async function oembedRoute(req) {
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
        params: { articleId, learningpathId },
      } = match;
      const { title } = learningpathId
        ? await fetchLearningpath(learningpathId, lang)
        : await fetchArticle(articleId, lang);
      const html = learningpathId
        ? `<iframe aria-label="${title}" src="${config.ndlaFrontendDomain}/learningpath-iframe/${lang}/learningpath/${articleId}" frameborder="0" allowFullscreen="" />`
        : `<iframe aria-label="${title}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/article/${articleId}?removeRelatedContent=true" frameborder="0" allowFullscreen="" />`;

      return getOembedObject(req, title, html);
    }

    const resource = await fetchResource(`urn:resource:${resourceId}`, lang);
    const id = getIdFromResourceContentUri(resource);
    const html = isLearningPathResource(resource)
      ? `<iframe aria-label="${resource.name}" src="${config.ndlaFrontendDomain}/learningpath-iframe/${lang}/${resource.id}/${id}" frameborder="0" allowFullscreen="" />`
      : `<iframe aria-label="${resource.name}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${resource.id}/${id}?removeRelatedContent=true" frameborder="0" allowFullscreen="" />`;

    return getOembedObject(req, resource.name, html);
  } catch (error) {
    handleError(error);
    const status = error.status || INTERNAL_SERVER_ERROR;
    return {
      status,
      data: 'Internal server error',
    };
  }
}
