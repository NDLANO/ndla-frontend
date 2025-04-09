/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../../config";
import { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";
import { FormValues } from "./types";

export const sharedLearningpathLink = (id: number, language?: string) => {
  const languageParam = language ? `/${language}` : "";
  return `${config.ndlaFrontendDomain}${languageParam}/learningpaths/${id}`;
};

export const copyLearningpathSharingLink = (id: number, language?: string) =>
  window.navigator.clipboard.writeText(sharedLearningpathLink(id, language));

export const LEARNINGPATH_SHARED = "UNLISTED";
export const LEARNINGPATH_PRIVATE = "PRIVATE";
export const LEARNINGPATH_READY_FOR_SHARING = "READY_FOR_SHARING";

export const getFormTypeFromStep = (step?: GQLMyNdlaLearningpathStepFragment): FormValues["type"] => {
  if (!step?.resource && !step?.oembed && !step?.embedUrl) return "text";
  if (step?.resource || step.embedUrl?.url.includes("resource")) return "resource";
  if (step?.embedUrl?.embedType === "external") return "external";
  return "text";
};

export const learningpathListItemId = (id: number) => `learningpath-${id}`;
