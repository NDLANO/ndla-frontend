/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $getRoot, $insertNodes, EditorState } from 'lexical';
import { forwardRef, useState } from 'react';
import styled from '@emotion/styled';
import { $generateNodesFromDOM } from '@lexical/html';
import { $convertToMarkdownString } from '@lexical/markdown';
import {
  LexicalComposer,
  InitialConfigType,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { colors, misc, spacing } from '@ndla/core';
import { useFormControl } from '@ndla/forms';
import { editorTheme } from './editorTheme';
import { EditorToolbar } from './EditorToolbar';
import { FloatingLinkEditorPlugin } from './FloatingLinkEditorPlugin';
import { MarkdownPlugin, PLAYGROUND_TRANSFORMERS } from './MarkdownPlugin';
import { editorNodes } from './nodes';

const onError = (error: any) => {
  console.error(error);
};

const EditableWrapper = styled.div`
  border-bottom-left-radius: ${misc.borderRadius};
  border-bottom-right-radius: ${misc.borderRadius};
  background-color: ${colors.brand.greyLightest};
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
      padding-left: ${spacing.small};
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
  border: 1px solid ${colors.brand.greyLight};
`;

const InnerEditorContainer = styled.div`
  position: relative;
`;

interface Props {
  setContentWritten: (data: string) => void;
  initialValue: string;
  name: string;
}

export const MarkdownEditor = forwardRef(
  ({ name, setContentWritten, initialValue }: Props, _) => {
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<
      HTMLDivElement | undefined
    >(undefined);
    const props = useFormControl({});
    const initialConfig: InitialConfigType = {
      namespace: 'MyEditor',
      onError,
      nodes: editorNodes,
      theme: editorTheme,
      editorState: (editor) => {
        const parser = new DOMParser();
        const nodes = $generateNodesFromDOM(
          editor,
          parser.parseFromString(initialValue, 'text/html'),
        );
        $getRoot().select();
        $insertNodes(nodes);
      },
    };

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
      if (_floatingAnchorElem !== null) {
        setFloatingAnchorElem(_floatingAnchorElem);
      }
    };

    const onChange = (editorState: EditorState) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
        setContentWritten(markdown);
      });
    };

    return (
      <StyledEditorContainer>
        <LexicalComposer initialConfig={initialConfig}>
          <EditorToolbar />
          <InnerEditorContainer>
            <RichTextPlugin
              contentEditable={
                <EditableWrapper ref={onRef}>
                  <ContentEditable name={name} role="textbox" {...props} />
                </EditableWrapper>
              }
              placeholder={<span />}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </InnerEditorContainer>
          {floatingAnchorElem ? (
            <FloatingLinkEditorPlugin anchorElement={floatingAnchorElem} />
          ) : (
            ''
          )}
          <ListPlugin />
          <LinkPlugin />
          <MarkdownPlugin />
          <HistoryPlugin />
          <OnChangePlugin ignoreSelectionChange onChange={onChange} />
        </LexicalComposer>
      </StyledEditorContainer>
    );
  },
);
