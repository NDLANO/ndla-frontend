/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { OverrideEditor, createPlatePlugin } from "@udecode/plate/react";
import { ElementApi, NodeApi, NodeEntry } from "@udecode/slate";

export const withNormalizeSpan: OverrideEditor = ({
  editor: {
    transforms: { normalizeNode, removeNodes },
  },
}) => {
  const normalizeFn = (entry: NodeEntry) => {
    const [node, path] = entry;

    console.log("we actually do get here", node);
    if (ElementApi.isElement(node) && node.type === "span") {
      if (NodeApi.string(node) === "") {
        return removeNodes({ at: path });
      }
    }

    normalizeNode(entry);
  };
  return {
    transforms: {
      normalizeNode: normalizeFn,
    },
  };
};

export const spanPlugin = createPlatePlugin({
  key: "normalize-span",
}).overrideEditor(withNormalizeSpan);
