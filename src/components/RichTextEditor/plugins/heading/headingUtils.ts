/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { unreachable } from "../../../../util/guards";
import { TextType } from "./headingTypes";

export const getHotKey = (textType: TextType) => {
  switch (textType) {
    case "normal-text":
      return "mod+alt+0";
    case "heading-2":
      return "mod+alt+2";
    case "heading-3":
      return "mod+alt+3";
    default:
      return unreachable(textType);
  }
};
