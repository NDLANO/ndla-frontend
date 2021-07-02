/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLResource } from './graphqlTypes';
import { matchPath } from 'react-router-dom';
import {
  PROGRAMME_PAGE_PATH,
  PROGRAMME_PATH,
  SUBJECT_PAGE_PATH,
  TOPIC_PATH,
} from './constants';

import { getProgrammeBySlug } from './data/programmes';
import { getSubjectBySubjectIdFilters } from './data/subjects';

export function toSearch(searchQuery : string) {
  return `/search?${searchQuery || ''}`;
}

export const removeUrn = (string : string) => (string ? string.replace('urn:', '') : '');

export function getUrnIdsFromProps(props) {
  const {
    ndlaFilm,
    match: { params },
  } = props;
  const paramSubjectId = params.subjectId
    ? `urn:subject:${params.subjectId}`
    : undefined;
  const subjectId = ndlaFilm ? `urn:subject:20` : paramSubjectId;
  const topics = params.topicPath?.split('/') || [];
  const topicList = topics.map(t => `urn:${t}`);
  const topicId = params.topicId ? `urn:${params.topicId}` : undefined;
  if (topicId) {
    topicList.push(topicId);
  }

  return {
    subjectId,
    topicList,
    resourceId: params.resourceId
      ? `urn:resource:${params.resourceId}`
      : undefined,
    articleId: params.articleId,
    topicId: topicList[topicList.length - 1],
  };
}

function toLearningpaths() {
  return '/learningpaths';
}

export function toLearningPath(pathId?: string, stepId?: string, resource?: GQLResource, filters = '') {
  const filterParams = filters.length > 0 ? `?filters=${filters}` : '';
  if (resource) {
    return stepId
      ? `${resource.path}/${stepId}${filterParams}`
      : `${resource.path}${filterParams}`;
  }
  if (pathId && stepId) {
    return `${toLearningpaths()}/${pathId}/steps/${stepId}${filterParams}`;
  }
  if (pathId) {
    return `${toLearningpaths()}/${pathId}${filterParams}`;
  }
  return `${filterParams}`;
}

export function toArticle(articleId: string, resource: GQLResource, subjectTopicPath: string, filters = '') {
  const filterParams = filters.length > 0 ? `?filters=${filters}` : '';
  if (subjectTopicPath) {
    return `${subjectTopicPath}/${removeUrn(resource.id)}${filterParams}`;
  }
  if (resource) {
    return `${resource.path}/${filterParams}`;
  }
  return `/article/${articleId}${filterParams}`;
}

export function toSubject(subjectId: string, filters: string) {
  const filterParam =
    filters && filters.length > 0 ? `?filters=${filters}` : '';
  return `/${removeUrn(subjectId)}${filterParam}`;
}

export function toTopic(subjectId: string, filters: string, ...topicIds: string[]) {
  const urnFreeSubjectId = removeUrn(subjectId);
  if (topicIds.length === 0) {
    return toSubject(urnFreeSubjectId, filters);
  }
  const urnFreeTopicIds = topicIds.filter(id => !!id).map(removeUrn);
  const filterParam =
    filters && filters.length > 0 ? `?filters=${filters}` : '';
  const t =
    fixEndSlash(`/${urnFreeSubjectId}/${urnFreeTopicIds.join('/')}`) +
    filterParam;
  return t;
}

export const toTopicPartial = (
  subjectId: string,
  filters = '',
  ...topicIds: string[]
) => (topicId: string) => toTopic(subjectId, filters, ...topicIds, topicId);

export function toBreadcrumbItems(
  rootName,
  paths,
  filters = '',
  locale = 'nb',
) {
  // henter longname fra filter og bruk i stedet for første ledd i path
  const subject = paths[0];
  const subjectData = getSubjectBySubjectIdFilters(
    subject?.id,
    filters.split(','),
  );
  const breadcrumbSubject = {
    ...subject,
    name: subjectData?.longName[locale] || subject?.name,
  };
  const filterParam = filters.length > 0 ? `?filters=${filters}` : '';
  const links = [breadcrumbSubject, ...paths.splice(1)]
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
      to: links.to + filterParam,
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

export function toLinkProps(linkObject, locale: "nb" | "nn" | "en") {
  const isLearningpath =
    linkObject.contentUri &&
    linkObject.contentUri.startsWith('urn:learningpath') &&
    linkObject.meta;
  return {
    to: isLearningpath ? toLearningPath() + linkObject.path : linkObject.path,
  };
}

export function toProgramme(programmePath: string) {
  return `${PROGRAMME_PATH}/${programmePath}`;
}

export function toProgrammeSubject(
  programmePath: string,
  subjectId,
  filterIds,
  topicIds,
) {
  const filterString = filterIds.join(',');
  return `${toProgramme(programmePath)}${toTopic(
    subjectId,
    filterString,
    topicIds,
  )}`;
}

export function isSubjectPagePath(pathname) {
  const match = matchPath(pathname, SUBJECT_PAGE_PATH);
  if (match) {
    return match.isExact;
  }
  return false;
}

export function isTopicPath(pathname) {
  const match = matchPath(pathname, TOPIC_PATH);
  if (match) {
    return match.isExact;
  }
  return false;
}

export function getProgrammeByPath(pathname, locale) {
  const match = matchPath(pathname, PROGRAMME_PAGE_PATH);
  if (match) {
    return getProgrammeBySlug(match.params.programme, locale);
  }
  return null;
}
