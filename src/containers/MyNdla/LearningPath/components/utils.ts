/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import config from "../../../../config";

export const sharedLearningPathLink = (id: number) => `${config.ndlaFrontendDomain}/learningpath/${id}`;

export const copyLearningPathSharingLink = (id: number) =>
  window.navigator.clipboard.writeText(sharedLearningPathLink(id));
