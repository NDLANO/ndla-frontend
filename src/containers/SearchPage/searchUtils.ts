/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const RESOURCE_NODE_TYPE = "resource";
export const TOPIC_NODE_TYPE = "topic";
export const SUBJECT_NODE_TYPE = "subject";
export const ALL_NODE_TYPES = "all";

export const defaultNodeType = (isLti: boolean) => {
  return isLti ? RESOURCE_NODE_TYPE : ALL_NODE_TYPES;
};
