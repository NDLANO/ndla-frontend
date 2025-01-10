/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementApi, SlateEditor } from "@udecode/plate";
import { type AutoformatBlockRule, type AutoformatRule } from "@udecode/plate-autoformat";
import { AutoformatPlugin } from "@udecode/plate-autoformat/react";
import { toggleList, unwrapList } from "@udecode/plate-list";
import { BulletedListPlugin, ListItemPlugin, NumberedListPlugin } from "@udecode/plate-list/react";

export const preFormat: AutoformatBlockRule["preFormat"] = (editor) => unwrapList(editor);

export const format = (editor: SlateEditor, customFormatting: any) => {
  if (editor.selection) {
    const parentEntry = editor.api.parent(editor.selection);

    if (!parentEntry) return;

    const [node] = parentEntry;

    if (ElementApi.isElement(node)) {
      customFormatting();
    }
  }
};

export const formatList = (editor: SlateEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor, {
      type: elementType,
    }),
  );
};

export const autoformatLists: AutoformatRule[] = [
  {
    format: (editor) => formatList(editor, BulletedListPlugin.key),
    match: ["* ", "- "],
    mode: "block",
    preFormat,
    type: ListItemPlugin.key,
  },
  {
    format: (editor) => formatList(editor, NumberedListPlugin.key),
    match: [String.raw`^\d+\.$ `, String.raw`^\d+\)$ `],
    matchByRegex: true,
    mode: "block",
    preFormat,
    type: ListItemPlugin.key,
  },
];

export const autoformatListPlugin = AutoformatPlugin.configure({
  options: {
    enableUndoOnDelete: true,
    rules: [...autoformatLists],
  },
});
