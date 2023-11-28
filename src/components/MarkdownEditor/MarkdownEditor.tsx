/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { EditorState } from 'lexical';
import {
  LexicalComposer,
  InitialConfigType,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import {
  $convertToMarkdownString,
  $convertFromMarkdownString,
} from '@lexical/markdown';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import styled from '@emotion/styled';
import { colors, misc, spacing } from '@ndla/core';
import { EditorToolbar } from './EditorToolbar';
import { editorNodes } from './nodes';
import { MarkdownPlugin, PLAYGROUND_TRANSFORMERS } from './MarkdownPlugin';
import { editorTheme } from './editorTheme';
import { FloatingLinkEditorPlugin } from './FloatingLinkEditorPlugin';

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

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  padding: ${spacing.small};
  color: ${colors.brand.greyMedium};
`;

const InnerEditorContainer = styled.div`
  position: relative;
`;

interface Props {
  setContentWritten: (data: string) => void;
  initialValue: string;
}

export const MarkdownEditor = ({ setContentWritten, initialValue }: Props) => {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<
    HTMLDivElement | undefined
  >(undefined);
  const initialConfig: InitialConfigType = {
    namespace: 'MyEditor',
    onError,
    nodes: editorNodes,
    theme: editorTheme,
    editorState: () =>
      $convertFromMarkdownString(initialValue, PLAYGROUND_TRANSFORMERS),
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
                <ContentEditable />
              </EditableWrapper>
            }
            placeholder={<Placeholder>Enter some text...</Placeholder>}
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
};
