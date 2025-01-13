/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlatePlugin, ElementApi, OverrideEditor } from "@udecode/plate";
import { SectionElement } from "../elements/SectionElement";

export const withNormalizeSection: OverrideEditor = ({
  editor,
  tf: { normalizeNode, wrapNodes, insertNode, removeNodes, insertNodes },
}) => ({
  transforms: {
    normalizeNode: ([node, path]) => {
      if (path.length === 0) {
        // Check if there's already a `section` at the top level
        const hasSection =
          editor.children.length === 1 &&
          ElementApi.isElement(editor.children[0]) &&
          editor.children[0].type === "section";

        if (!hasSection) {
          // Wrap all nodes inside a `section`
          wrapNodes({ type: "section", children: editor.children }, { at: [] });
          insertNode({ type: "section", children: editor.children });
          removeNodes({ at: [0] });
          return;
        }

        // Ensure the section has at least one valid child
        const sectionNode = editor.children[0];
        if (sectionNode?.children.length === 0) {
          insertNodes({ type: "p", children: [{ text: "" }] }, { at: [0, 0] });
        }
      }

      // Call the original normalization function
      normalizeNode([node, path]);
    },
  },
});

export const sectionPlugin = createSlatePlugin({
  key: "section",
  node: {
    isElement: true,
    type: "section",
    component: SectionElement,
  },
}).overrideEditor(withNormalizeSection);
