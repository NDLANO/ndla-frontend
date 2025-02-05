/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Descendant } from "slate";
import { Editable, Slate } from "slate-react";
import {
  breakPlugin,
  createSlate,
  headingPlugin,
  linkPlugin,
  LoggerManager,
  paragraphPlugin,
  sectionPlugin,
  softBreakPlugin,
} from "@ndla/editor";
import { styled } from "@ndla/styled-system/jsx";
import { AnchorElement } from "./Elements/AnchorElement";
import { BreakElement } from "./Elements/BreakElement";
import { HeadingElement } from "./Elements/HeadingElement";
import { ListElement } from "./Elements/ListElement";
import { ParagraphElement } from "./Elements/ParagraphElement";
import { SectionElement } from "./Elements/SectionElement";
import { MarkLeaf } from "./Leafs/MarkLeaf";
import { inlinePlugin } from "./plugins/inline/inlinePlugin";
import { listPlugin } from "./plugins/list/listPlugin";
import { markPlugin } from "./plugins/mark/markPlugin";
import { RichTextToolbar } from "./Toolbar/RichTextToolbar";

interface Props {
  initialValue: Descendant[];
}

const StyledEditable = styled(
  Editable,
  {
    base: {
      paddingInline: "xsmall",
      _focusVisible: {
        outline: "none",
      },
    },
  },
  { baseComponent: true },
);

const EditorWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: "xsmall",
    border: "1px solid",
    borderColor: "stroke.subtle",
  },
});

export const RichTextEditor = ({ initialValue }: Props) => {
  const [editor] = useState(() =>
    createSlate({
      plugins: [
        inlinePlugin,
        sectionPlugin,
        headingPlugin,
        markPlugin,
        listPlugin,
        paragraphPlugin,
        linkPlugin,
        softBreakPlugin,
        breakPlugin,
      ],
      elementRenderers: [SectionElement, ParagraphElement, AnchorElement, BreakElement, HeadingElement, ListElement],
      leafRenderers: [MarkLeaf],
      logger: new LoggerManager({ debug: true }),
    }),
  );

  return (
    <EditorWrapper className="ndla-article">
      <Slate editor={editor} initialValue={initialValue}>
        <RichTextToolbar />
        <StyledEditable
          onKeyDown={editor.onKeyDown}
          renderElement={(props) => editor.renderElement?.(props) || <div {...props.attributes}>{props.children}</div>}
          renderLeaf={(props) => editor.renderLeaf?.(props) || <span {...props.attributes}>{props.children}</span>}
        />
      </Slate>
    </EditorWrapper>
  );
};
