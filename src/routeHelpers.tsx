/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath, RouteComponentProps } from 'react-router-dom';
import {
  PROGRAMME_PAGE_PATH,
  PROGRAMME_PATH,
  SUBJECT_PAGE_PATH,
  TOPIC_PATH,
} from './constants';
// @ts-ignore
import { getProgrammeBySlug } from './data/programmes';
// @ts-ignore
import { getSubjectLongName } from './data/subjects';
import { LocaleType } from './interfaces';

export function toSearch(searchString?: string) {
  return `/search?${searchString || ''}`;
}

export const removeUrn = (str?: string) => (str ? str.replace('urn:', '') : '');

export function getUrnIdsFromProps(props: {
  ndlaFilm?: boolean;
  match: RouteComponentProps<{
    subjectId?: string;
    topicPath?: string;
    topicId?: string;
    resourceId?: string;
    articleId?: string;
  }>['match'];
}) {
  const {
    ndlaFilm,
    match: { params },
  } = props;
  const paramSubjectId = params.subjectId
    ? `urn:subject:${params.subjectId}`
    : undefined;
  const subjectId = ndlaFilm ? `urn:subject:20` : paramSubjectId;
  const topics = params.topicPath?.split('/') || [];
  const topicList = topics.map((t: string) => `urn:${t}`);
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

type Resource = {
  path: string;
  id: string;
};

export function toLearningPath(
  pathId?: string,
  stepId?: string,
  resource?: Resource,
) {
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

export function toArticle(
  articleId: number,
  resource: Resource,
  subjectTopicPath: string,
) {
  if (subjectTopicPath) {
    return `${subjectTopicPath}/${removeUrn(resource.id)}`;
  }
  if (resource) {
    return resource.path;
  }
  return `/article/${articleId}`;
}

export function toSubject(subjectId: string) {
  return `/${removeUrn(subjectId)}`;
}

export function toTopic(subjectId: string, ...topicIds: string[]) {
  const urnFreeSubjectId = removeUrn(subjectId);
  if (topicIds.length === 0) {
    return toSubject(urnFreeSubjectId);
  }
  const urnFreeTopicIds = topicIds.filter(id => !!id).map(removeUrn);
  const t = fixEndSlash(`/${urnFreeSubjectId}/${urnFreeTopicIds.join('/')}`);
  return t;
}

export const toTopicPartial = (subjectId: string, ...topicIds: string[]) => (
  topicId: string,
) => toTopic(subjectId, ...topicIds, topicId);

type Subject = {
  id?: string;
  name?: string;
  to?: string;
};

export function toBreadcrumbItems(
  rootName: string,
  paths: Subject[],
  locale: LocaleType = 'nb',
) {
  // henter longname fra filter og bruk i stedet for første ledd i path
  const subject = paths[0];
  const longName = getSubjectLongName(subject?.id || '', locale);
  const breadcrumbSubject = {
    ...subject,
    name: longName || subject?.name,
  };

  const prelinks = [breadcrumbSubject, ...paths.splice(1)];

  const links = prelinks
    .filter(Boolean)
    .reduce(
      (links: Subject[], item) => [
        ...links,
        {
          to:
            (links.length ? links?.[links.length - 1]?.to : '') +
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

export function fixEndSlash(link: string) {
  const pattern = new RegExp(/resource/gi);
  if (link && !pattern.test(link) && !/\/$/.test(link)) {
    link = `${link}/`;
  }
  return link;
}

type LinkObject = {
  contentUri?: string;
  meta?: object;
  path: string;
};

export function toLinkProps(linkObject: LinkObject) {
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
  subjectId: string,
  topicIds: string[],
) {
  return `${toProgramme(programmePath)}${toTopic(subjectId, ...topicIds)}`;
}

export function isSubjectPagePath(pathname: string) {
  const match = matchPath(pathname, SUBJECT_PAGE_PATH);
  if (match) {
    return match.isExact;
  }
  return false;
}

export function isTopicPath(pathname: string) {
  const match = matchPath(pathname, TOPIC_PATH);
  if (match) {
    return match.isExact;
  }
  return false;
}

export function getProgrammeByPath(pathname: string, locale: LocaleType) {
  const match = matchPath<{ programme?: string }>(
    pathname,
    PROGRAMME_PAGE_PATH,
  );
  if (match) {
    return getProgrammeBySlug(match.params.programme!, locale);
  }
  return null;
}
