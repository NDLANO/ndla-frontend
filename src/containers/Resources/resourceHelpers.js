/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../../config';
import { toArticle } from '../../routes';

const LEARNING_PATH_DOMAIN = __SERVER__ || process.env.NODE_ENV === 'unittest'
  ? config.learningPathDomain
  : window.config.learningPathDomain;
export const URN_ARTICLE = 'urn:article:';
export const URN_LEARTNING_PATH = 'urn:learningpath:';

const hasContentUri = resource => (resource && resource.contentUri) || false;

export const isLearningPathResource = resource =>
  hasContentUri(resource) && resource.contentUri.startsWith(URN_LEARTNING_PATH);
export const isArticleResource = resource =>
  hasContentUri(resource) &&
  resource.contentUri.startsWith(URN_ARTICLE) &&
  resource.contentUri.length > 12;

export const getArticleIdFromResource = resource => {
  if (isArticleResource(resource)) {
    return resource.contentUri.replace(URN_ARTICLE, '');
  }
  return undefined;
};

export const getLearningPathIdFromResource = resource => {
  if (isLearningPathResource(resource)) {
    return resource.contentUri.replace(URN_LEARTNING_PATH, '');
  }
  return undefined;
};

export const resourceToLinkProps = (resource, subjectId, topicId) => {
  if (isLearningPathResource(resource)) {
    return {
      href: `${LEARNING_PATH_DOMAIN}/learningpaths/${getLearningPathIdFromResource(resource)}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  } else if (isArticleResource(resource)) {
    return {
      to: toArticle(getArticleIdFromResource(resource), subjectId, topicId),
    };
  }
  return { to: '/404' };
};
