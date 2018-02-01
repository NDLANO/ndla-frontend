/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function toSearch() {
  return '/search';
}

const removeUrn = string => {
  if (string.startsWith('urn:')) {
    return string.substring(4, string.length);
  }
  return string;
};
const stripUrn = path =>
  path
    .split('/')
    .map(part => (part.startsWith('urn:') ? part.substring(0, 3) : part))
    .join('/');

export function getUrnParams(params) {
  return {
    subjectId: params.subjectId ? `urn:${params.subjectId}` : undefined,
    topicId: params.topicId ? `urn:${params.topicId}` : undefined,
    resourceId: params.resourceId ? `urn:${params.resourceId}` : undefined,
    articleId: params.articleId,
  };
}

export function toArticle(articleId, resource) {
  if (resource) {
    // const resourcePath = resource.path
    //   .split('/')
    //   .filter(part => part !== '')
    //   .map(part => `urn:${part}`)
    //   .join('/');
    return `/article/${resource.path}/`;
  }
  return `/article/${articleId}`;
}

export function toSubject(subjectId) {
  return `/subjects/${removeUrn(subjectId)}`;
}

export function toTopic(subjectId, ...topicIds) {
  if (topicIds.length === 0) {
    return toSubject(subjectId);
  }
  return `/subjects/${subjectId}/${topicIds.join('/')}`;
}

export const toTopicPartial = (subjectId, ...topicIds) => topicId =>
  toTopic(subjectId, ...topicIds, topicId);
