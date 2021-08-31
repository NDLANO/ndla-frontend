/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../../config';
import { GQLResource } from '../../graphqlTypes';
import { toArticle, toLearningPath } from '../../routeHelpers';

export const URN_ARTICLE = 'urn:article:';
export const URN_LEARTNING_PATH = 'urn:learningpath:';

export const hasContentUri = (resource: GQLResource) =>
  (resource && resource.contentUri) || false;

export const isLearningPathResource = (resource: GQLResource) =>
  hasContentUri(resource) &&
  resource!.contentUri!.startsWith(URN_LEARTNING_PATH);

export const isArticleResource = (resource: GQLResource) =>
  hasContentUri(resource) &&
  resource!.contentUri!.startsWith(URN_ARTICLE) &&
  resource!.contentUri!.length > 12;

export const getArticleIdFromResource = (resource: GQLResource) => {
  if (isArticleResource(resource)) {
    return resource!.contentUri!.replace(URN_ARTICLE, '');
  }
  return undefined;
};

export const getLearningPathIdFromResource = (resource: GQLResource) => {
  if (isLearningPathResource(resource)) {
    return resource!.contentUri!.replace(URN_LEARTNING_PATH, '');
  }
  return undefined;
};

export function getLearningPathUrlFromResource(
  resource: GQLResource,
  languagePrefix?: string,
) {
  return `${config.learningPathDomain}${
    languagePrefix ? `/${languagePrefix}` : ''
  }/learningpaths/${getLearningPathIdFromResource(resource)}/first-step`;
}

export const resourceToLinkProps = (
  resource: GQLResource,
  subjectTopicPath: string,
  //@ts-ignore
  language?: string,
) => {
  if (isLearningPathResource(resource)) {
    return {
      to: toLearningPath(undefined, undefined, {
        path: resource.path!,
        id: resource.id,
      }),
    };
  }
  if (isArticleResource(resource)) {
    return {
      to: toArticle(
        parseInt(getArticleIdFromResource(resource)!),
        {
          path: resource.path!,
          id: resource.id,
        },
        subjectTopicPath,
      ),
    };
  }
  return { to: '/404' };
};
