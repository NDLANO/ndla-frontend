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

const removeUrn = string => string.replace('urn:', '');

export function getUrnIdsFromProps(props) {
  const { match: { params } } = props;
  return {
    subjectId: params.subjectId ? `urn:${params.subjectId}` : undefined,
    topicId: params.topicId ? `urn:${params.topicId}` : undefined,
    resourceId: params.resourceId ? `urn:${params.resourceId}` : undefined,
    articleId: params.articleId,
  };
}

export function toArticle(articleId, resource) {
  if (resource) {
    return `/subjects${resource.path}/`;
  }
  return `/article/${articleId}`;
}

export function toSubject(subjectId) {
  return `/subjects/${removeUrn(subjectId)}`;
}

export function toTopic(subjectId, ...topicIds) {
  const urnFreeSubjectId = removeUrn(subjectId);
  if (topicIds.length === 0) {
    return toSubject(urnFreeSubjectId);
  }
  const urnFreeTopicIds = topicIds.map(removeUrn);

  return `/subjects/${urnFreeSubjectId}/${urnFreeTopicIds.join('/')}`;
}

export const toTopicPartial = (subjectId, ...topicIds) => topicId =>
  toTopic(subjectId, ...topicIds, topicId);
