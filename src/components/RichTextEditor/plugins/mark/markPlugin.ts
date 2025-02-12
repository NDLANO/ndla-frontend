/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { markPlugin as baseMarkPlugin, marks, toggleMark } from "@ndla/editor";
import { isKeyHotkey } from "is-hotkey";
import { BOLD_SHORTCUT, ITALIC_SHORTCUT } from "./markShortcuts";

export const markPlugin = baseMarkPlugin.configure({
  shortcuts: {
    toggleBold: {
      keyCondition: isKeyHotkey(BOLD_SHORTCUT),
      handler: (editor, event) => {
        event.preventDefault();
        toggleMark(editor, marks.strong);
        return false;
      },
    },
    toggleItalic: {
      keyCondition: isKeyHotkey(ITALIC_SHORTCUT),
      handler: (editor, event) => {
        event.preventDefault();
        toggleMark(editor, marks.em);
        return false;
      },
    },
  },
});
