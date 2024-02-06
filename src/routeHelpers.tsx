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
  MULTIDISCIPLINARY_SUBJECT_ID,
  PROGRAMME_PATH,
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_TEACHER_SUBJECT_ID,
} from "./constants";
import { GQLResource, GQLSubject, GQLTopic } from "./graphqlTypes";
import { Breadcrumb } from "./interfaces";

export function toSearch(searchString?: string) {
  return `/search?${searchString || ""}`;
}

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
  slug?: string;
}

export const useOnTopicPage = () => {
  const { subjectId, resourceId, topicList } = useUrnIds();
  if (!subjectId || resourceId || (subjectId && topicList.length === 0)) {
    return false;
  }
  const subjectType = getSubjectType(subjectId);
  if (subjectType === "multiDisciplinary") {
    return topicList.length < 3;
  }

  return true;
};

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
    stepId: params.stepId,
    subjectType: subjectId ? getSubjectType(subjectId) : undefined,
    slug: params.slug,
  };
};

type SubjectType = "multiDisciplinary" | "standard" | "toolbox" | "film" | undefined;

export const getSubjectType = (subjectId: string): SubjectType => {
  if (subjectId === MULTIDISCIPLINARY_SUBJECT_ID) {
    return "multiDisciplinary";
  } else if (subjectId === TOOLBOX_STUDENT_SUBJECT_ID || subjectId === TOOLBOX_TEACHER_SUBJECT_ID) {
    return "toolbox";
  } else if (subjectId === "urn:subject:20") {
    return "film";
  } else if (typeof subjectId === "string") {
    return "standard";
  }

  return undefined;
};

export const useIsNdlaFilm = () => {
  const { subjectType } = useUrnIds();
  return subjectType === "film";
};

function toLearningpaths() {
  return "/learningpaths";
}

type Resource = {
  path: string;
  id: string;
};

export function toLearningPath(pathId?: string | number, stepId?: string | number, resource?: Pick<Resource, "path">) {
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

export function toArticle(articleId: number, resource: Resource, subjectTopicPath: string) {
  if (subjectTopicPath) {
    return `${subjectTopicPath}/${removeUrn(resource.id)}`;
  }
  if (resource) {
    return resource.path;
  }
  return `/article/${articleId}`;
}

export const toAbout = (slug = "") => `${ABOUT_PATH}${slug}`;

export function toSubject(subjectId: string) {
  return `/${removeUrn(subjectId)}`;
}

export function toTopic(subjectId: string, ...topicIds: string[]) {
  const urnFreeSubjectId = removeUrn(subjectId);
  if (topicIds.length === 0) {
    return toSubject(urnFreeSubjectId);
  }
  const urnFreeTopicIds = topicIds.filter((id) => !!id).map(removeUrn);
  const t = fixEndSlash(`/${urnFreeSubjectId}/${urnFreeTopicIds.join("/")}`);
  return t;
}

export function toFolderPreview(folderId: string) {
  return `/folder/${folderId}`;
}

export type SubjectURI = {
  id?: string;
  name?: string;
  to?: string;
};

export function toBreadcrumbItems(rootName: string, paths: ({ id: string; name: string } | undefined)[]): Breadcrumb[] {
  const safePaths = paths.filter((p): p is GQLTopic | GQLResource | GQLSubject => p !== undefined);
  const [subject, ...rest] = safePaths;
  if (!subject) return [];
  // henter longname fra filter og bruk i stedet for første ledd i path
  const breadcrumbSubject = safePaths[0]!;

  const links = [breadcrumbSubject, ...rest];
  const breadcrumbs = links
    .reduce<Breadcrumb[]>((acc, link) => {
      const prefix = acc.length ? acc[acc.length - 1]?.to : "";
      const to = `${prefix}/${removeUrn(link.id)}`;
      return acc.concat([{ to, name: link.name }]);
    }, [])
    .map((bc) => ({ ...bc, to: fixEndSlash(bc.to) }));
  return [{ to: "/", name: rootName }, ...breadcrumbs];
}

export function fixEndSlash(link: string) {
  const pattern = new RegExp(/resource/gi);
  if (link && !pattern.test(link) && !/\/$/.test(link)) {
    link = `${link}/`;
  }
  return link;
}

export function toProgramme(programmePath: string, grade?: string) {
  const gradeString = grade ? `/${grade}` : "";
  return `${PROGRAMME_PATH}/${programmePath}${gradeString}`;
}

export function toProgrammeSubject(programmePath: string, subjectId: string, topicIds: string[]) {
  return `${toProgramme(programmePath)}${toTopic(subjectId, ...topicIds)}`;
}

export type TypedParams = Record<string, string | undefined>;

export const useTypedParams = <TParams extends TypedParams>() => {
  return useParams() as TParams;
};

export const MyNdla = "/minndla";
export const MyNdlaArena = `${MyNdla}/arena`;
export const MyNdlaFolders = `${MyNdla}/folders`;
export const MyNdlaSubjects = `${MyNdla}/subjects`;
export const MyNdlaTags = `${MyNdla}/tags`;
export const MyNdlaNotifications = `${MyNdlaArena}/notifications`;
export const MyNdlaAdmin = `${MyNdla}/admin`;
export const MyNdlaAdminFlags = `${MyNdlaAdmin}/flags`;

export const toMyNdlaArenaCategory = (categoryId: number) => {
  return `${MyNdlaArena}/category/${categoryId}`;
};

export const toMyNdlaArenaTopic = (topicId?: number) => {
  return `${MyNdlaArena}/topic/${topicId}`;
};

export const toMyNdlaArenaUser = (username: String) => {
  return `${MyNdlaArena}/user/${username}`;
};

export const toMyNdlaFolder = (folderId: String) => {
  return `${MyNdlaFolders}/${folderId}`;
};

export const toMyNdlaFolderPreview = (folderId: String) => {
  return `${MyNdlaFolders}/preview/${folderId}`;
};

export const toMyNdlaAdminUsers = (params: String) => {
  return `${MyNdlaAdmin}/users${params}`;
};

export const toMyNdlaAdminFlagsWithParams = (params: String) => {
  return `${MyNdlaAdminFlags}${params}`;
};
