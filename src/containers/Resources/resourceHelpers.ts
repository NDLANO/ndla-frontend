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

export const hasContentUri = (resource: Pick<GQLResource, 'contentUri'>) =>
  (resource && resource.contentUri) || false;

export const isLearningPathResource = (
  resource: Pick<GQLResource, 'contentUri'>,
) =>
  hasContentUri(resource) &&
  resource!.contentUri!.startsWith(URN_LEARTNING_PATH);

export const isArticleResource = (resource: Pick<GQLResource, 'contentUri'>) =>
  hasContentUri(resource) &&
  resource!.contentUri!.startsWith(URN_ARTICLE) &&
  resource!.contentUri!.length > 12;

export const getArticleIdFromResource = (
  resource: Pick<GQLResource, 'contentUri'>,
) => {
  if (isArticleResource(resource)) {
    return resource!.contentUri!.replace(URN_ARTICLE, '');
  }
  return undefined;
};

export const getLearningPathIdFromResource = (
  resource: Pick<GQLResource, 'contentUri'>,
) => {
  if (isLearningPathResource(resource)) {
    return resource!.contentUri!.replace(URN_LEARTNING_PATH, '');
  }
  return undefined;
};

export function getLearningPathUrlFromResource(
  resource: Pick<GQLResource, 'contentUri'>,
  languagePrefix?: string,
) {
  return `${config.learningPathDomain}${
    languagePrefix ? `/${languagePrefix}` : ''
  }/learningpaths/${getLearningPathIdFromResource(resource)}/first-step`;
}

export const resourceToLinkProps = (
  resource: Pick<GQLResource, 'id' | 'path' | 'contentUri'>,
  subjectTopicPath: string,
) => {
  if (isLearningPathResource(resource)) {
    return {
      to: toLearningPath(undefined, undefined, {
        path: resource.path!,
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
