/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $getRoot, EditorState } from "lexical";
import { ComponentProps, forwardRef, useRef, useState } from "react";
import styled from "@emotion/styled";
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
import { colors, misc, spacing } from "@ndla/core";
import { useFormControl } from "@ndla/forms";
import { AutoLink } from "./AutoLinkPlugin";
import { editorTheme } from "./editorTheme";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingLinkEditorPlugin } from "./FloatingLinkEditorPlugin";
import { MarkdownPlugin, PLAYGROUND_TRANSFORMERS } from "./MarkdownPlugin";
import { editorNodes } from "./nodes";
import { RefPlugin } from "./RefPlugin";

const onError = (error: any) => {
  console.error(error);
};

const EditableWrapper = styled.div`
  border-bottom-left-radius: ${misc.borderRadius};
  border-bottom-right-radius: ${misc.borderRadius};
  background-color: ${colors.white};
  min-height: 115px;
  display: flex;
  flex-direction: column;

  [contenteditable] {
    padding: ${spacing.small};
    flex: 1;
    p {
      margin: 0px;
    }
    li {
      margin: 0px;
    }
    ul,
    ol {
      padding: 0px;
      padding-left: ${spacing.normal};
      margin: 0px;
    }
  }
`;

const StyledEditorContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  border-radius: ${misc.borderRadius};
  border: 1px solid ${colors.brand.grey};
`;

const InnerEditorContainer = styled.div`
  position: relative;
`;

const StyledContentEditable = styled(ContentEditable)`
  &:focus-visible {
    outline-width: 2px;
    outline-style: solid;
    outline-color: ${colors.brand.primary};
    border-radius: ${misc.borderRadius};
  }
`;

interface Props extends ComponentProps<"div"> {
  setContentWritten: (data: string) => void;
  initialValue: string;
  name: string;
}

const MarkdownEditor = forwardRef<HTMLDivElement, Props>(({ setContentWritten, initialValue, ...rest }, ref) => {
  const floatingAnchorElem = useRef<HTMLDivElement | null>(null);
  const props = useFormControl(rest);
  const [editorFocused, setEditorFocused] = useState(false);
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
    <StyledEditorContainer>
      <LexicalComposer initialConfig={initialConfig}>
        <EditorToolbar editorIsFocused={editorFocused} />
        <InnerEditorContainer>
          <RichTextPlugin
            contentEditable={
              <EditableWrapper ref={floatingAnchorElem}>
                <StyledContentEditable
                  role="textbox"
                  ariaActiveDescendant={props["aria-activedescendant"]}
                  ariaAutoComplete={props["aria-autocomplete"]}
                  ariaControls={props["aria-controls"]}
                  ariaDescribedBy={props["aria-describedby"]}
                  ariaExpanded={props["aria-expanded"]}
                  ariaLabel={props["aria-label"]}
                  ariaLabelledBy={props["aria-labelledby"]}
                  ariaMultiline={props["aria-multiline"]}
                  ariaOwns={props["aria-owns"]}
                  ariaRequired={props["aria-required"]}
                  onFocus={(e) => {
                    setEditorFocused(true);
                    rest.onFocus?.(e);
                  }}
                  onBlur={(e) => {
                    setEditorFocused(false);
                    rest.onBlur?.(e);
                  }}
                  {...props}
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
    </StyledEditorContainer>
  );
});

export default MarkdownEditor;
