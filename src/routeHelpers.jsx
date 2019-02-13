/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from './config';

export function toSearch() {
  return '/search';
}

export const removeUrn = string => string.replace('urn:', '');

export function getUrnIdsFromProps(props) {
  const {
    match: { params },
  } = props;
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

export function toLearningPath(id, locale = 'nb') {
  return `${
    config.learningPathDomain
  }/${locale}/learningpaths/${id}/first-step`;
}
export function toArticle(articleId, resource, subjectTopicPath, filters = '') {
  const filterParams = filters.length > 0 ? `?filters=${filters}` : '';
  if (subjectTopicPath) {
    return `${toSubjects()}${subjectTopicPath}/${removeUrn(
      resource.id,
    )}${filterParams}`;
  }
  if (resource) {
    return `${toSubjects()}${resource.path}/${filterParams}`;
  }
  return `/article/${articleId}${filterParams}`;
}

export function toSubject(subjectId) {
  return `${toSubjects()}/${removeUrn(subjectId)}`;
}

export function toTopic(subjectId, filters, ...topicIds) {
  const urnFreeSubjectId = removeUrn(subjectId);
  if (topicIds.length === 0) {
    return toSubject(urnFreeSubjectId);
  }
  const urnFreeTopicIds = topicIds.filter(id => !!id).map(removeUrn);
  const filterParam =
    filters && filters.length > 0 ? `?filters=${filters}` : '';
  const t = `${toSubjects()}/${urnFreeSubjectId}/${urnFreeTopicIds.join(
    '/',
  )}${filterParam}`;
  return t;
}

export const toTopicPartial = (
  subjectId,
  filters = '',
  ...topicIds
) => topicId => toTopic(subjectId, filters, ...topicIds, topicId);

export function toBreadcrumbItems(rootName, paths, filters = '') {
  const filterParam = filters.length > 0 ? `?filters=${filters}` : '';

  const links = paths
    .filter(path => path !== undefined)
    .reduce(
      (links, item) => [
        ...links,
        {
          to:
            (links.length ? links[links.length - 1].to : '') +
            '/' +
            removeUrn(item.id),
          name: item.name,
        },
      ],
      [],
    )
    .map(links => ({
      ...links,
      to: toSubjects() + links.to + filterParam,
    }));

  return [{ to: '/', name: rootName }, ...links];
}

export function toLinkProps(linkObject, locale) {
  const isLearningpath =
    linkObject.contentUri &&
    linkObject.contentUri.startsWith('urn:learningpath') &&
    linkObject.meta;
  return {
    to: isLearningpath
      ? toLearningPath(linkObject.meta.id, locale)
      : toSubjects() + linkObject.path,
    target: isLearningpath ? '_blank' : undefined,
    rel: isLearningpath ? 'noreferrer noopener' : undefined,
  };
}
