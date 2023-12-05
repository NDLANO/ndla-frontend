/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  ElementNode,
  RangeSelection,
  TextNode,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  KEY_MODIFIER_COMMAND,
} from 'lexical';
import styled from '@emotion/styled';
import { $isAtNodeEnd } from '@lexical/selection';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $findMatchingParent,
  mergeRegister,
  $getNearestNodeOfType,
} from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconButtonV2 } from '@ndla/button';
import { colors, misc, spacing } from '@ndla/core';
import {
  Bold,
  Italic,
  Link,
  ListCircle,
  ListNumbered,
} from '@ndla/icons/editor';
import { ADD_LINK_COMMAND } from './FloatingLinkEditorPlugin';
import { useUserAgent } from '../../UserAgentContext';

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  background-color: ${colors.white};
  border-top-left-radius: ${misc.borderRadius};
  border-top-right-radius: ${misc.borderRadius};
  border-bottom: 1px solid ${colors.brand.greyLight};
  padding: ${spacing.small};
`;

const StyledButton = styled(IconButtonV2)`
  color: ${colors.text.primary};
  border-radius: ${misc.borderRadius};
  &[data-active='true'] {
    background: ${colors.brand.neutral7};
  }
  &[disabled] {
    background: ${colors.brand.greyLighter};
  }
`;

export const getSelectedNode = (
  selection: RangeSelection,
): TextNode | ElementNode => {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
};

export const EditorToolbar = () => {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isUnorderedList, setIsUnorderedList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [hasSelectedText, setHasSelectedText] = useState(false);
  const selectors = useUserAgent();

  const osCtrl = useCallback(
    (key: string) => {
      if (selectors?.isMobile) return '';
      return `(${selectors?.isMacOs ? '⌘' : 'Ctrl'}+${key})`;
    },
    [selectors?.isMacOs, selectors?.isMobile],
  );

  const linkLabel = useMemo(() => {
    if (!hasSelectedText) return t('markdownEditor.toolbar.link.noSelection');
    const baseText = t(
      `markdownEditor.toolbar.link.${isLink ? 'active' : 'inactive'}`,
    );
    return `${baseText} ${osCtrl('k')}`;
  }, [hasSelectedText, isLink, osCtrl, t]);

  const insertLink = useCallback(() => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      editor.dispatchCommand(ADD_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const formatBulletList = useCallback(() => {
    if (!isUnorderedList) {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }, [editor, isUnorderedList]);

  const formatNumberedList = useCallback(() => {
    if (!isNumberedList) {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }, [editor, isNumberedList]);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));

      setHasSelectedText(selection.anchor.offset !== selection.focus.offset);

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(node) || $isLinkNode(parent);
      setIsLink(isLink);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setIsUnorderedList(type === 'bullet');
          setIsNumberedList(type === 'number');
        } else {
          setIsUnorderedList(false);
          setIsNumberedList(false);
        }
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          if (isLink) {
            activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          } else if (hasSelectedText) {
            activeEditor.dispatchCommand(ADD_LINK_COMMAND, null);
          }
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, hasSelectedText, isLink]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
    );
  }, [$updateToolbar, activeEditor, editor]);

  return (
    <ButtonRow>
      <StyledButton
        variant="ghost"
        colorTheme="greyLighter"
        aria-label={`${t(
          `markdownEditor.toolbar.bold.${isBold ? 'active' : 'inactive'}`,
        )} ${osCtrl('b')}`}
        title={`${t(
          `markdownEditor.toolbar.bold.${isBold ? 'active' : 'inactive'}`,
        )} ${osCtrl('b')}`}
        data-active={isBold}
        onClick={() =>
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }
      >
        <Bold />
      </StyledButton>

      <StyledButton
        variant="ghost"
        colorTheme="greyLighter"
        aria-label={`${t(
          `markdownEditor.toolbar.italic.${isItalic ? 'active' : 'inactive'}`,
        )} ${osCtrl('i')}`}
        title={`${t(
          `markdownEditor.toolbar.italic.${isItalic ? 'active' : 'inactive'}`,
        )} ${osCtrl('i')} `}
        data-active={isItalic}
        onClick={() =>
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }
      >
        <Italic />
      </StyledButton>
      <StyledButton
        variant="ghost"
        colorTheme="greyLighter"
        data-active={isUnorderedList}
        onClick={formatBulletList}
        aria-label={t(
          `markdownEditor.toolbar.unorderedList.${
            isUnorderedList ? 'active' : 'inactive'
          }`,
        )}
        title={t(
          `markdownEditor.toolbar.unorderedList.${
            isUnorderedList ? 'active' : 'inactive'
          }`,
        )}
      >
        <ListCircle />
      </StyledButton>
      <StyledButton
        variant="ghost"
        colorTheme="greyLighter"
        data-active={isNumberedList}
        onClick={formatNumberedList}
        aria-label={t(
          `markdownEditor.toolbar.orderedList.${
            isNumberedList ? 'active' : 'inactive'
          }`,
        )}
        title={t(
          `markdownEditor.toolbar.orderedList.${
            isNumberedList ? 'active' : 'inactive'
          }`,
        )}
      >
        <ListNumbered />
      </StyledButton>
      <StyledButton
        variant="ghost"
        data-active={isLink}
        disabled={!isLink && !hasSelectedText}
        onClick={insertLink}
        colorTheme="greyLighter"
        aria-label={linkLabel}
        title={linkLabel}
      >
        <Link />
      </StyledButton>
    </ButtonRow>
  );
};
