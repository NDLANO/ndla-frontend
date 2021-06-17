/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../../config';
import { toArticle, toLearningPath } from '../../routeHelpers';

export const URN_ARTICLE = 'urn:article:';
export const URN_LEARTNING_PATH = 'urn:learningpath:';

export const hasContentUri = resource =>
  (resource && resource.contentUri) || false;

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

export function getLearningPathUrlFromResource(resource, languagePrefix) {
  return `${config.learningPathDomain}${
    languagePrefix ? `/${languagePrefix}` : ''
  }/learningpaths/${getLearningPathIdFromResource(resource)}/first-step`;
}

export const resourceToLinkProps = (resource, subjectTopicPath, language) => {
  if (isLearningPathResource(resource)) {
    return {
      to: toLearningPath(undefined, undefined, resource),
    };
  }
  if (isArticleResource(resource)) {
    return {
      to: toArticle(
        getArticleIdFromResource(resource),
        resource,
        subjectTopicPath,
      ),
    };
  }
  return { to: '/404' };
};
