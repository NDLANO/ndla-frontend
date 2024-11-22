/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $getRoot, EditorState } from "lexical";
import { ComponentPropsWithRef, forwardRef, useRef, useState } from "react";
import { useFieldContext } from "@ark-ui/react";
import { $generateNodesFromDOM } from "@lexical/html";
import { $convertToMarkdownString } from "@lexical/markdown";
import { LexicalComposer, InitialConfigType } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { styled } from "@ndla/styled-system/jsx";
import { AutoLink } from "./AutoLinkPlugin";
import { editorTheme } from "./editorTheme";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingLinkEditorPlugin } from "./FloatingLinkEditorPlugin";
import { MarkdownPlugin, PLAYGROUND_TRANSFORMERS } from "./MarkdownPlugin";
import { editorNodes } from "./nodes";
import { RefPlugin } from "./RefPlugin";

const onError = (error: any) => {
  // eslint-disable-next-line no-console
  console.error(error);
};

const EditableWrapper = styled("div", {
  base: {
    borderBottomLeftRadius: "xsmall",
    borderBottomRightRadius: "xsmall",
  },
});

const OuterEditorContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: "xsmall",
    border: "1px solid",
    borderColor: "stroke.subtle",
  },
});

const InnerEditorContainer = styled("div", {
  base: {
    position: "relative",
  },
});

const StyledContentEditable = styled(
  ContentEditable,
  {
    base: {
      minHeight: "surface.3xsmall",
      padding: "xsmall",
      _focusVisible: {
        outlineStyle: "solid",
        outlineColor: "stroke.subtle",
        borderBottomLeftRadius: "xsmall",
        borderBottomRightRadius: "xsmall",
      },
      "& > li": {
        display: "list-item",
      },
      "& ul": {
        paddingLeft: "medium",
        listStyle: "initial",
        margin: "initial",
      },
      "& ol": {
        paddingLeft: "medium",
        listStyle: "numeric",
        margin: "initial",
      },
    },
  },
  { baseComponent: true },
);

// ContentEditable has some weird types. Omitting ref from props fixes this. TODO: Revise this for react 19
interface Props extends Omit<ComponentPropsWithRef<"div">, "ref"> {
  setContentWritten: (data: string) => void;
  initialValue: string;
  name: string;
}

const MarkdownEditor = forwardRef<HTMLDivElement, Props>(({ setContentWritten, initialValue, ...rest }, ref) => {
  const floatingAnchorElem = useRef<HTMLDivElement | null>(null);
  const [editorFocused, setEditorFocused] = useState(false);

  const field = useFieldContext();

  const textAreaProps = field?.getTextareaProps() ?? {};

  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    onError,
    nodes: editorNodes,
    theme: editorTheme,
    editorState: (editor) => {
      const parser = new DOMParser();
      const nodes = $generateNodesFromDOM(editor, parser.parseFromString(initialValue, "text/html"));
      $getRoot().select().insertNodes(nodes);
      setContentWritten($convertToMarkdownString(PLAYGROUND_TRANSFORMERS));
    },
  };

  /**
   * ConvertToMarkDownString length also includes markdown markup to get correct content length we use $rootTextContent.
   * Usage inspired by https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/shared/useCharacterLimit.ts
   * */
  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
      setContentWritten(markdown);
    });
  };

  return (
    <OuterEditorContainer>
      <LexicalComposer initialConfig={initialConfig}>
        <EditorToolbar editorIsFocused={editorFocused} />
        <InnerEditorContainer>
          <RichTextPlugin
            contentEditable={
              <EditableWrapper ref={floatingAnchorElem}>
                <StyledContentEditable
                  id="markdown-editor"
                  role="textbox"
                  ariaDescribedBy={textAreaProps["aria-describedby"]}
                  aria-invalid={textAreaProps["aria-invalid"]}
                  ariaRequired={textAreaProps["aria-required"]}
                  aria-readonly={textAreaProps["aria-readonly"]}
                  readOnly={textAreaProps.readOnly}
                  required={textAreaProps.required}
                  disabled={textAreaProps.disabled}
                  onFocus={(e) => {
                    setEditorFocused(true);
                    rest.onFocus?.(e);
                  }}
                  onBlur={(e) => {
                    setEditorFocused(false);
                    rest.onBlur?.(e);
                  }}
                  {...rest}
                />
              </EditableWrapper>
            }
            placeholder={<span />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </InnerEditorContainer>
        {floatingAnchorElem.current ? (
          <FloatingLinkEditorPlugin anchorElement={floatingAnchorElem.current} editorIsFocused={editorFocused} />
        ) : (
          ""
        )}
        <RefPlugin ref={ref} />
        <AutoLink />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownPlugin />
        <HistoryPlugin />
        <OnChangePlugin ignoreSelectionChange onChange={onChange} />
      </LexicalComposer>
    </OuterEditorContainer>
  );
});

export default MarkdownEditor;
