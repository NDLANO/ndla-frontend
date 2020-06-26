/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath } from 'react-router-dom';
import { SUBJECT_PAGE_PATH } from './constants';

export function toSearch(searchString) {
  return `/search?${searchString || ''}`;
}

export const removeUrn = string => (string ? string.replace('urn:', '') : '');

export function getUrnIdsFromProps(props) {
  const {
    ndlaFilm,
    match: { params },
  } = props;
  const paramSubjectId = params.subjectId
    ? `urn:${params.subjectId}`
    : undefined;
  const subjectId = ndlaFilm ? `urn:subject:20` : paramSubjectId;
  
  return {
    subjectId,
    topicId: params.topicId ? `urn:${params.topicId}` : undefined,
    subTopicId: params.subTopicId ? `urn:${params.subTopicId}` : undefined,
    resourceId: params.resourceId
      ? `urn:resource:${params.resourceId}`
      : undefined,
    articleId: params.articleId,
  };
}

export function toSubjects() {
  return `/subjects`;
}

function toLearningpaths() {
  return '/learningpaths';
}

export function toLearningPath(pathId, stepId, resource, filters = '') {
  const filterParams = filters.length > 0 ? `?filters=${filters}` : '';
  if (resource) {
    return stepId
      ? `${toSubjects()}${resource.path}/${stepId}${filterParams}`
      : `${toSubjects()}${resource.path}${filterParams}`;
  }
  if (pathId && stepId) {
    return `${toLearningpaths()}/${pathId}/steps/${stepId}${filterParams}`;
  }
  if (pathId) {
    return `${toLearningpaths()}/${pathId}${filterParams}`;
  }
  return `${toSubjects()}${filterParams}`;
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
  const t =
    fixEndSlash(
      `${toSubjects()}/${urnFreeSubjectId}/${urnFreeTopicIds.join('/')}`,
    ) + filterParam;
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
    .filter(Boolean)
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
    .map(link => {
      // making sure we have the ending slash in breadCrumbs and it dosen't contain it allready
      if (link.to) {
        link.to = fixEndSlash(link.to);
      }
      return link;
    })
    .map(links => ({
      ...links,
      to: toSubjects() + links.to + filterParam,
    }));
  return [{ to: '/', name: rootName }, ...links];
}

export function fixEndSlash(link) {
  const pattern = new RegExp(/resource/gi);
  if (link && !pattern.test(link) && !/\/$/.test(link)) {
    link = `${link}/`;
  }
  return link;
}

export function toLinkProps(linkObject, locale) {
  const isLearningpath =
    linkObject.contentUri &&
    linkObject.contentUri.startsWith('urn:learningpath') &&
    linkObject.meta;
  return {
    to: isLearningpath
      ? toLearningPath() + linkObject.path
      : toSubjects() + linkObject.path,
  };
}

export function isSubjectPagePath(pathname) {
  const match = matchPath(pathname, SUBJECT_PAGE_PATH);
  if (match) {
    return match.isExact;
  }
  return false;
}
