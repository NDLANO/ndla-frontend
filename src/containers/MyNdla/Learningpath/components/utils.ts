/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import config from "../../../../config";

export const sharedLearningpathLink = (id: number) => `${config.ndlaFrontendDomain}/learningpath/${id}`;

export const copyLearningpathSharingLink = (id: number) =>
  window.navigator.clipboard.writeText(sharedLearningpathLink(id));

export const LEARNINGPATH_SHARED = "UNLISTED";
export const LEARNINGPATH_PRIVATE = "PRIVATE";
export const LEARNINGPATH_READY_FOR_SHARING = "READY_FOR_SHARING";
