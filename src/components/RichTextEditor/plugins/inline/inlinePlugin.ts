/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isKeyHotkey } from "is-hotkey";
import { Range, Transforms } from "slate";
import { createPlugin } from "@ndla/editor";

export const inlinePlugin = createPlugin({
  name: "inline-plugin",
  shortcuts: {
    "inline-left": {
      keyCondition: isKeyHotkey("left"),
      handler: (editor, event) => {
        if (editor.selection && Range.isCollapsed(editor.selection)) {
          event.preventDefault();
          Transforms.move(editor, { unit: "offset", reverse: true });
          return true;
        }
        return false;
      },
    },
    "inline-right": {
      keyCondition: isKeyHotkey("right"),
      handler: (editor, event) => {
        if (editor.selection && Range.isCollapsed(editor.selection)) {
          event.preventDefault();
          Transforms.move(editor, { unit: "offset" });
          return true;
        }
        return false;
      },
    },
  },
});
