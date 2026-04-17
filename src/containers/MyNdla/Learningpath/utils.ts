/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../../config";

export const sharedLearningpathLink = (id: number, language?: string) => {
  const languageParam = language ? `/${language}` : "";
  return `${config.ndlaFrontendDomain}${languageParam}/learningpaths/${id}`;
};

export const copyLearningpathSharingLink = (id: number, language?: string) =>
  window.navigator.clipboard.writeText(sharedLearningpathLink(id, language));

export const LEARNINGPATH_SHARED = "UNLISTED";
export const LEARNINGPATH_PRIVATE = "PRIVATE";
export const LEARNINGPATH_READY_FOR_SHARING = "READY_FOR_SHARING";

export const learningpathListItemId = (id: number) => `learningpath-${id}`;
export const learningpathStepEditButtonId = (id: number) => `edit-button-${id}`;
export const learningpathStepCloseButtonId = (id: number) => `close-button-${id}`;
