/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { headingPlugin as _headingPlugin, PARAGRAPH_ELEMENT_TYPE, toggleHeading } from "@ndla/editor";
import { isHotkey } from "is-hotkey";
import { Transforms } from "slate";
import { getHotKey } from "./headingUtils";

export const headingPlugin = _headingPlugin.configure({
  shortcuts: {
    toggleNormalText: {
      keyCondition: isHotkey(getHotKey("normal-text")),
      handler: (editor, event, logger) => {
        if (!editor.selection) return false;
        event.preventDefault();
        logger.log("Toggling normal text");
        Transforms.setNodes(editor, { type: PARAGRAPH_ELEMENT_TYPE }, { at: editor.selection });
        return true;
      },
    },
    toggleH2: {
      keyCondition: isHotkey(getHotKey("heading-2")),
      handler: (editor, event, logger) => {
        if (!editor.selection) return false;
        event.preventDefault();
        logger.log("Toggling H2 heading");
        toggleHeading(editor, 2);
        return true;
      },
    },
    toggleH3: {
      keyCondition: isHotkey(getHotKey("heading-3")),
      handler: (editor, event, logger) => {
        if (!editor.selection) return false;
        event.preventDefault();
        logger.log("Toggling H3 heading");
        toggleHeading(editor, 3);
        return true;
      },
    },
  },
});
