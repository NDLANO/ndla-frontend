/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EditorThemeClasses } from "lexical";
import "./editor.css";

// For now this just exists to show text that is both bold and italic at the same time.
export const editorTheme: EditorThemeClasses = {
  text: {
    bold: "textBold",
    italic: "textItalic",
  },
};
