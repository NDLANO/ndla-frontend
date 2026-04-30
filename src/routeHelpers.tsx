/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "./config";
import {
  ABOUT_PATH,
  FILM_ID,
  MULTIDISCIPLINARY_SUBJECT_ID,
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_TEACHER_SUBJECT_ID,
} from "./constants";
import type { GQLTaxBase, GQLTaxonomyCrumb } from "./graphqlTypes";
import type { Breadcrumb } from "./interfaces";

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

export const toRevision = (articleId: number | string, revision: number | string) => {
  return `/article/${articleId}?revision=${revision}`;
};

export const toRevisions = (articleId: number | string) => {
  return `/revisions/${articleId}`;
};

export const toAbout = (slug = "") => `${ABOUT_PATH}/${slug}`;

export function toBreadcrumbItems(
  rootName: string,
  paths: (GQLTaxBase | GQLTaxonomyCrumb | undefined)[],
): Breadcrumb[] {
  const safePaths = paths.filter(Boolean);
  if (safePaths.length === 0) return [];
  const breadcrumbs = safePaths.map((crumb) => {
    return {
      url: crumb?.url ?? "",
      name: crumb?.name ?? "",
    };
  });
  return [{ url: "/", name: rootName }, ...breadcrumbs];
}

export function toProgramme(programmePath?: string, grade?: string) {
  const gradeString = grade ? `/${grade}` : "";
  if (config.runWithOldTaxonomyApi) {
    return `/utdanning${programmePath}${gradeString}`;
  }
  return `${programmePath}${gradeString}`;
}

export const routes = {
  folder: (folderId: string) => `/folder/${folderId}`,
  learningpath: (learningpathId: number) => `/learningpaths/${learningpathId}`,
  myNdla: {
    root: "/minndla",
    profile: "/minndla/profile",
    folders: (folderId: string | undefined) => `/minndla/folders${folderId ? `/${folderId}` : ""}`,
    subjects: "/minndla/subjects",
    learningpath: "/minndla/learningpaths",
    learningpathNew: "/minndla/learningpaths/new",
    learningpathEditTitle: (learningpathId: number) => `/minndla/learningpaths/${learningpathId}/edit/title`,
    learningpathEditSteps: (learningpathId: number) => `/minndla/learningpaths/${learningpathId}/edit/steps`,
    learningpathEditStep: (learningpathId: number, stepId: number | string) =>
      `/minndla/learningpaths/${learningpathId}/edit/steps/${stepId}`,
    learningpathPreview: (learningpathId: number, stepId?: number) => {
      const path = `/minndla/learningpaths/${learningpathId}/preview`;
      return stepId ? `${path}/${stepId}` : path;
    },
    learningpathSave: (learningpathId: number) => `/minndla/learningpaths/${learningpathId}/save`,
  },
};
