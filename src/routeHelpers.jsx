/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath } from 'react-router-dom';
import {
  PROGRAMME_PAGE_PATH,
  PROGRAMME_PATH,
  SUBJECT_PAGE_PATH,
  TOPIC_PATH,
} from './constants';

import { getProgrammeBySlug } from './data/programmes';
import { getSubjectBySubjectId } from './data/subjects';

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

export function toLearningPath(pathId, stepId, resource) {
  if (resource) {
    return stepId ? `${resource.path}/${stepId}` : resource.path;
  }
  if (pathId && stepId) {
    return `${toLearningpaths()}/${pathId}/steps/${stepId}`;
  }
  if (pathId) {
    return `${toLearningpaths()}/${pathId}`;
  }
  return toLearningpaths();
}

export function toArticle(articleId, resource, subjectTopicPath) {
  if (subjectTopicPath) {
    return `${subjectTopicPath}/${removeUrn(resource.id)}`;
  }
  if (resource) {
    return resource.path;
  }
  return `/article/${articleId}`;
}

export function toSubject(subjectId) {
  return `/${removeUrn(subjectId)}`;
}

export function toTopic(subjectId, ...topicIds) {
  const urnFreeSubjectId = removeUrn(subjectId);
  if (topicIds.length === 0) {
    return toSubject(urnFreeSubjectId);
  }
  const urnFreeTopicIds = topicIds.filter(id => !!id).map(removeUrn);
  const t = fixEndSlash(`/${urnFreeSubjectId}/${urnFreeTopicIds.join('/')}`);
  return t;
}

export const toTopicPartial = (subjectId, ...topicIds) => topicId =>
  toTopic(subjectId, ...topicIds, topicId);

export function toBreadcrumbItems(rootName, paths, locale = 'nb') {
  // henter longname fra filter og bruk i stedet for første ledd i path
  const subject = paths[0];
  const subjectData = getSubjectBySubjectId(subject?.id);
  const breadcrumbSubject = {
    ...subject,
    name: subjectData?.longName[locale] || subject?.name,
  };
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
    });
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
    to: isLearningpath ? toLearningPath() + linkObject.path : linkObject.path,
  };
}

export function toProgramme(programmePath) {
  return `${PROGRAMME_PATH}/${programmePath}`;
}

export function toProgrammeSubject(programmePath, subjectId, topicIds) {
  return `${toProgramme(programmePath)}${toTopic(subjectId, topicIds)}`;
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
