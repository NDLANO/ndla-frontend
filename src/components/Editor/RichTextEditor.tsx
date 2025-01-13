/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlateEditor, ParagraphPlugin, PlateContent } from "@udecode/plate/react";
import { BoldPlugin, ItalicPlugin } from "@udecode/plate-basic-marks/react";
import { BulletedListPlugin, ListItemPlugin, ListPlugin, NumberedListPlugin } from "@udecode/plate-list/react";
import { RemoveEmptyNodesPlugin } from "@udecode/plate-normalizers";
import { styled } from "@ndla/styled-system/jsx";
import { LinkElement } from "./elements/LinkElement";
import { ListItemElement } from "./elements/ListItemElement";
import { OrderedListElement } from "./elements/OrderedListElement";
import { ParagraphElement } from "./elements/ParagraphElement";
import { SpanElement } from "./elements/SpanElement";
import { UnorderedListElement } from "./elements/UnorderedListElement";
import { BoldLeaf } from "./leafs/Bold";
import { ItalicLeaf } from "./leafs/Italic";
import { autoformatListPlugin } from "./plugins/autoFormatPlugin";
import { linkPlugin } from "./plugins/linkPlugin";
import { sectionPlugin } from "./plugins/sectionPlugin";
import { spanPlugin } from "./plugins/spanPlugin";
import { Toolbar } from "./toolbar/Toolbar";

const EditorWrapper = styled("div", {
  base: {
    border: "1px solid",
    borderColor: "stroke.subtle",
    borderRadius: "xsmall",
  },
});

const StyledEditor = styled(
  PlateContent,
  {
    base: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      borderRadius: "xsmall",
      padding: "xsmall",
      outline: "none",

      _focusVisible: {
        outlineStyle: "solid",
        outlineColor: "stroke.subtle",
        outlineWidth: "3px",
        outlineOffset: "0",
      },
    },
  },
  { baseComponent: true },
);

export const richTextEditorComponents = {
  [BoldPlugin.key]: BoldLeaf,
  [ItalicPlugin.key]: ItalicLeaf,
  [NumberedListPlugin.key]: OrderedListElement,
  [BulletedListPlugin.key]: UnorderedListElement,
  [ListItemPlugin.key]: ListItemElement,
  [ParagraphPlugin.key]: ParagraphElement,
  [linkPlugin.key]: LinkElement,
  [spanPlugin.key]: SpanElement,
  lic: ParagraphElement,
};

export const useRichTextEditor = (initialValue?: any) => {
  const editor = createPlateEditor({
    value: initialValue,
    shouldNormalizeEditor: true,
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      ListPlugin,
      ParagraphPlugin,
      linkPlugin,
      autoformatListPlugin,
      sectionPlugin,
      spanPlugin,
      RemoveEmptyNodesPlugin,
    ],
    override: {
      components: richTextEditorComponents,
    },
  });

  return editor;
};

export const RichTextEditor = () => {
  return (
    <EditorWrapper>
      <Toolbar />
      <StyledEditor placeholder="Type..." className="ndla-article" />
    </EditorWrapper>
  );
};
