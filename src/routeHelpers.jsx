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
    resourceId: params.resourceId
      ? `urn:resource:${params.resourceId}`
      : undefined,
    articleId: params.articleId,
  };
}

export function toSubjects() {
  return `/subjects`;
}

export function toArticle(articleId, resource, subjectTopicPath) {
  if (subjectTopicPath) {
    return `${toSubjects()}${subjectTopicPath}/${removeUrn(resource.id)}`;
  } else if (resource) {
    return `${toSubjects()}${resource.path}/`;
  }
  return `/article/${articleId}`;
}

export function toSubject(subjectId) {
  return `${toSubjects()}/${removeUrn(subjectId)}`;
}

export function toTopic(subjectId, ...topicIds) {
  const urnFreeSubjectId = removeUrn(subjectId);
  if (topicIds.length === 0) {
    return toSubject(urnFreeSubjectId);
  }
  const urnFreeTopicIds = topicIds.filter(id => !!id).map(removeUrn);

  return `${toSubjects()}/${urnFreeSubjectId}/${urnFreeTopicIds.join('/')}`;
}

export const toTopicPartial = (subjectId, ...topicIds) => topicId =>
  toTopic(subjectId, ...topicIds, topicId);

export function toBreadcrumbItems(
  subject,
  topicPath = [],
  resource,
  toFrontPage = '',
) {
  const topicLinks = topicPath.map(topic => ({
    to: toSubjects() + topic.path,
    name: topic.name,
  }));

  const resourceLink = resource
    ? [{ to: toSubjects() + resource.path, name: resource.name }]
    : [];

  return [
    { to: '/', name: toFrontPage },
    { to: toSubjects() + subject.path, name: subject.name },
    ...topicLinks,
    ...resourceLink,
  ];
}
