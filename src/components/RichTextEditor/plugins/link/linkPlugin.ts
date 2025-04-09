/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { linkPlugin as _linkPlugin } from "@ndla/editor";
import { isKeyHotkey } from "is-hotkey";
import { LINK_SHORTCUT, LINK_TOOLBAR_BUTTON_ID } from "./linkUtils";

export const linkPlugin = _linkPlugin.configure({
  shortcuts: {
    upsertLink: {
      keyCondition: isKeyHotkey(LINK_SHORTCUT),
      handler: (_, event, logger) => {
        event.preventDefault();
        logger.log("Upserting link");
        const el = document.getElementById(LINK_TOOLBAR_BUTTON_ID);
        el?.click();
        return !!el;
      },
    },
  },
});
