/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { listPlugin as baseListPlugin, toggleList } from "@ndla/editor";
import { isKeyHotkey } from "is-hotkey";
import { BULLETED_LIST_SHORTCUT, NUMBERED_LIST_SHORTCUT } from "./listShortcuts";

export const listPlugin = baseListPlugin.configure({
  shortcuts: {
    toggleNumberedList: {
      keyCondition: isKeyHotkey(NUMBERED_LIST_SHORTCUT),
      handler: (editor, event, _, opts) => {
        event.preventDefault();
        toggleList(editor, "numbered-list", opts);
        return true;
      },
    },
    toggleBulletedList: {
      keyCondition: isKeyHotkey(BULLETED_LIST_SHORTCUT),
      handler: (editor, event, _, opts) => {
        event.preventDefault();
        toggleList(editor, "bulleted-list", opts);
        return true;
      },
    },
  },
});
