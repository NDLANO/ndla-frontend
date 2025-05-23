/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TextareaHTMLAttributes, useEffect, useMemo, useState } from "react";
import { Descendant } from "slate";
import { Editable, Slate } from "slate-react";
import { EditableProps } from "slate-react/dist/components/editable";
import {
  breakPlugin,
  createSlate,
  headingPlugin,
  inlineNavigationPlugin,
  LoggerManager,
  paragraphPlugin,
  sectionPlugin,
  softBreakPlugin,
  spanPlugin,
} from "@ndla/editor";
import { useFieldContext } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { BreakElement } from "./plugins/break/BreakElement";
import { HeadingElement } from "./plugins/heading/HeadingElement";
import { LinkElement } from "./plugins/link/LinkElement";
import { linkPlugin } from "./plugins/link/linkPlugin";
import { ListElement } from "./plugins/list/ListElement";
import { listPlugin } from "./plugins/list/listPlugin";
import { MarkLeaf } from "./plugins/mark/MarkLeaf";
import { markPlugin } from "./plugins/mark/markPlugin";
import { ParagraphElement } from "./plugins/paragraph/ParagraphElement";
import { SectionElement } from "./plugins/section/SectionElement";
import { SpanElement } from "./plugins/span/SpanElement";
import { RichTextToolbar } from "./Toolbar/RichTextToolbar";

interface Props extends Omit<TextareaHTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
  initialValue: Descendant[];
  onChange?: (value: Descendant[]) => void;
}

const StyledEditable = styled(
  Editable,
  {
    base: {
      backgroundColor: "background.default",
      paddingInline: "xsmall",
      borderRadius: "xsmall",
      borderTopRadius: "0px",
      border: "1px solid",
      borderColor: "stroke.subtle",
      _focusVisible: {
        borderColor: "surface.action.active",
        outline: "1px solid",
        outlineColor: "surface.action.active",
        outlineOffset: "-2px",
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
  },
});

export const RichTextEditor = ({ initialValue, onChange, ...rest }: Props) => {
  const [labelledBy, setLabelledBy] = useState<string | undefined>(undefined);
  const [editor] = useState(() =>
    createSlate({
      value: initialValue,
      plugins: [
        inlineNavigationPlugin,
        sectionPlugin,
        headingPlugin,
        markPlugin,
        listPlugin,
        paragraphPlugin,
        softBreakPlugin,
        breakPlugin,
        linkPlugin,
        spanPlugin,
      ],
      elementRenderers: [
        SectionElement,
        ParagraphElement,
        BreakElement,
        HeadingElement,
        ListElement,
        LinkElement,
        SpanElement,
      ],
      leafRenderers: [MarkLeaf],
      logger: new LoggerManager({ debug: true }),
      shouldNormalize: true,
    }),
  );

  const field = useFieldContext();
  const fieldProps = useMemo(() => (field?.getTextareaProps() as EditableProps | undefined) ?? {}, [field]);

  useEffect(() => {
    const labelEl = document.getElementById(field.ids.label);
    if (labelEl) {
      setLabelledBy(labelEl.id);
    }
  }, [field.ids.label]);

  return (
    <EditorWrapper className="ndla-article">
      <Slate editor={editor} initialValue={editor.children} onChange={onChange}>
        <RichTextToolbar />
        <StyledEditable
          onKeyDown={editor.onKeyDown}
          renderElement={(props) => editor.renderElement?.(props) || <div {...props.attributes}>{props.children}</div>}
          renderLeaf={(props) => editor.renderLeaf?.(props) || <span {...props.attributes}>{props.children}</span>}
          {...fieldProps}
          aria-labelledby={labelledBy}
          {...rest}
        />
      </Slate>
    </EditorWrapper>
  );
};

export default RichTextEditor;
