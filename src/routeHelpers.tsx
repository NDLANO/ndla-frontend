/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  ABOUT_PATH,
  FILM_ID,
  MULTIDISCIPLINARY_SUBJECT_ID,
  PROGRAMME_PATH,
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_TEACHER_SUBJECT_ID,
} from "./constants";
import { GQLTaxBase, GQLTaxonomyCrumb } from "./graphqlTypes";
import { Breadcrumb } from "./interfaces";

export const removeUrn = (str?: string) => str?.replace("urn:", "") ?? "";

interface MatchParams extends TypedParams {
  subjectId?: string;
  topicPath?: string;
  topicId?: string;
  resourceId?: string;
  articleId?: string;
  topic1?: string;
  topic2?: string;
  topic3?: string;
  topic4?: string;
  programme?: string;
  contextId?: string;
  slug?: string;
}

export const useUrnIds = () => {
  const params = useTypedParams<MatchParams>();
  const subjectId = params.subjectId ? `urn:subject${params.subjectId}` : undefined;
  const topicList = useMemo(() => {
    return [
      params.topic1 ? `urn:topic${params.topic1}` : "",
      params.topic2 ? `urn:topic${params.topic2}` : "",
      params.topic3 ? `urn:topic${params.topic3}` : "",
      params.topic4 ? `urn:topic${params.topic4}` : "",
      params.topicId ? `urn:topic${params.topicId}` : "",
    ].filter((s) => !!s.length);
  }, [params.topicId, params.topic1, params.topic2, params.topic3, params.topic4]);

  return {
    subjectId,
    topicList,
    resourceId: params.resourceId ? `urn:resource${params.resourceId}` : undefined,
    articleId: params.articleId,
    topicId: topicList[topicList.length - 1],
    programme: params.programme,
    contextId: params.contextId,
    stepId: params.stepId,
    subjectType: subjectId ? getSubjectType(subjectId) : undefined,
    slug: params.slug,
  };
};

export type SubjectType = "multiDisciplinary" | "standard" | "toolbox" | "film" | undefined;

export const getSubjectType = (subjectId?: string): SubjectType => {
  if (subjectId === MULTIDISCIPLINARY_SUBJECT_ID) {
    return "multiDisciplinary";
  } else if (subjectId === TOOLBOX_STUDENT_SUBJECT_ID || subjectId === TOOLBOX_TEACHER_SUBJECT_ID) {
    return "toolbox";
  } else if (subjectId === FILM_ID) {
    return "film";
  } else if (typeof subjectId === "string") {
    return "standard";
  }

  return undefined;
};

const LEARNINGPATHS = "/learningpaths";

type Resource = {
  path: string;
  id: string;
};

export function toLearningPath(pathId?: string | number, stepId?: string | number, resourcePath?: string) {
  if (resourcePath) {
    return stepId ? `${resourcePath}/${stepId}` : resourcePath;
  }
  if (pathId && stepId) {
    return `${LEARNINGPATHS}/${pathId}/steps/${stepId}`;
  }
  if (pathId) {
    return `${LEARNINGPATHS}/${pathId}`;
  }
  return LEARNINGPATHS;
}

export function toArticle(articleId: number, resource: Resource, subjectTopicPath: string) {
  if (subjectTopicPath) {
    return `${subjectTopicPath}/${removeUrn(resource.id)}`;
  }
  if (resource) {
    return resource.path;
  }
  return `/article/${articleId}`;
}

export const toAbout = (slug = "") => `${ABOUT_PATH}/${slug}`;

export function toBreadcrumbItems(
  rootName: string,
  paths: (GQLTaxBase | GQLTaxonomyCrumb | undefined)[],
): Breadcrumb[] {
  const safePaths = paths.filter(Boolean);
  if (safePaths.length === 0) return [];
  const breadcrumbs = safePaths.map((crumb) => {
    return {
      to: crumb?.url ?? "",
      name: crumb?.name ?? "",
    };
  });
  return [{ to: "/", name: rootName }, ...breadcrumbs];
}

export function toProgramme(programmePath?: string, grade?: string) {
  const gradeString = grade ? `/${grade}` : "";
  return `${PROGRAMME_PATH}${programmePath}${gradeString}`;
}

export type TypedParams = Record<string, string | undefined>;

export const useTypedParams = <TParams extends TypedParams>() => {
  return useParams() as TParams;
};

export const routes = {
  folder: (folderId: string) => `/folder/${folderId}`,
  learningpath: (learningpathId: number) => `/learningpaths/${learningpathId}`,
  myNdla: {
    root: "/minndla",
    profile: "/minndla/profile",
    arena: "/minndla/arena",
    folders: "/minndla/folders",
    subjects: "/minndla/subjects",
    notifications: "/minndla/arena/notifications",
    admin: "/minndla/admin",
    adminFlags: "/minndla/admin/flags",
    adminUsers: "/minndla/admin/users",
    arenaCategory: (categoryId: number) => `/minndla/arena/category/${categoryId}`,
    arenaTopic: (topicId?: number) => `/minndla/arena/topic/${topicId}`,
    arenaUser: (username: string) => `/minndla/arena/user/${username}`,
    folder: (folderId: string) => `/minndla/folders/${folderId}`,
    tag: (tag: string) => `/minndla/folders/tag/${encodeURIComponent(tag)}`,
    tags: "/minndla/folders/tag",
    learningpath: "/minndla/learningpaths",
    learningpathNew: "/minndla/learningpaths/new",
    learningpathEditTitle: (learningpathId: number) => `/minndla/learningpaths/${learningpathId}/edit/title`,
    learningpathEditSteps: (learningpathId: number) => `/minndla/learningpaths/${learningpathId}/edit/steps`,
    learningpathPreview: (learningpathId: number) => `/minndla/learningpaths/${learningpathId}/preview`,
    learningpathSave: (learningpathId: number) => `/minndla/learningpaths/${learningpathId}/save`,
  },
};
