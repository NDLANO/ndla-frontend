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

export function toArticle(articleId, resource) {
  if (resource) {
    const resourcePath = resource.path
      .split('/')
      .filter(part => part !== '')
      .map(part => `urn:${part}`)
      .join('/');
    return `/article/${resourcePath}/${articleId}`;
  }
  return `/article/${articleId}`;
}

export function toSubject(subjectId) {
  return `/subjects/${subjectId}`;
}

export function toTopic(subjectId, ...topicIds) {
  if (topicIds.length === 0) {
    return toSubject(subjectId);
  }
  return `/subjects/${subjectId}/${topicIds.join('/')}`;
}

export const toTopicPartial = (subjectId, ...topicIds) => topicId =>
  toTopic(subjectId, ...topicIds, topicId);
