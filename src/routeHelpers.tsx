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
import { getProgrammeBySlug } from './data/programmes';
import { GQLResource, GQLSubject, GQLTopic } from './graphqlTypes';
import { Breadcrumb, LocaleType } from './interfaces';

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
    topic1?: string;
    topic2?: string;
    programme?: string;
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
  const topic1 = params.topic1 ? `urn:topic:${params.topic1}` : undefined;
  const topic2 = params.topic2 ? `urn:topic:${params.topic2}` : undefined;
  if (topic1) {
    topicList.push(topic1);
  }
  if (topic2) {
    topicList.push(topic2);
  }
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
    programme: params.programme,
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
  pathId?: string | number,
  stepId?: string | number,
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

export type SubjectURI = {
  id?: string;
  name?: string;
  to?: string;
};

export function toBreadcrumbItems(
  rootName: string,
  paths: (GQLTopic | Pick<GQLResource, 'id'> | GQLSubject | undefined)[],
): Breadcrumb[] {
  const safePaths = paths.filter(
    (p): p is GQLTopic | GQLResource | GQLSubject => p !== undefined,
  );
  if (safePaths.length < 1) return [];
  // henter longname fra filter og bruk i stedet for første ledd i path
  const breadcrumbSubject = safePaths[0]!;

  const prelinks = [breadcrumbSubject, ...safePaths.splice(1)];
  const filteredLinks = prelinks.filter(l => !!l);
  const breadcrumbs = filteredLinks
    .reduce<Breadcrumb[]>((acc, link) => {
      const to =
        (acc.length ? acc?.[acc.length - 1]?.to : '') +
        '/' +
        removeUrn(link.id);
      return acc.concat([{ to, name: link.name }]);
    }, [])
    .map(bc => {
      if (bc.to) {
        bc.to = fixEndSlash(bc.to);
      }
      return bc;
    });
  return [{ to: '/', name: rootName }, ...breadcrumbs];
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
  path?: string;
};

export function toLinkProps(linkObject: LinkObject) {
  const isLearningpath =
    linkObject.contentUri &&
    linkObject.contentUri.startsWith('urn:learningpath') &&
    linkObject.meta;
  const path = linkObject.path || '';
  return {
    to: isLearningpath ? toLearningPath() + path : path,
  };
}

export function toProgramme(programmePath: string, grade?: string) {
  const gradeString = grade ? `/${grade}` : '';
  return `${PROGRAMME_PATH}/${programmePath}${gradeString}`;
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
  if (match?.params?.programme) {
    return getProgrammeBySlug(match.params.programme, locale);
  }
  return null;
}
