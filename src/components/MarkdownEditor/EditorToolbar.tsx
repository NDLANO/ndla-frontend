/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
  TextFormatType,
} from "lexical";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isAtNodeEnd } from "@lexical/selection";
import { $findMatchingParent, mergeRegister, $getNearestNodeOfType } from "@lexical/utils";
import { Bold, Italic, LinkMedium, ListUnordered, ListOrdered } from "@ndla/icons/editor";
import { ToggleGroupItem, ToggleGroupRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ADD_LINK_COMMAND } from "./FloatingLinkEditorPlugin";
import { useUserAgent } from "../../UserAgentContext";

const StyledToggleGroupRoot = styled(ToggleGroupRoot, {
  base: {
    backgroundColor: "surface.infoSubtle",
    borderTopLeftRadius: "small",
    borderTopRightRadius: "small",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    padding: "3xsmall",
    gap: "3xsmall",
  },
});

export const getSelectedNode = (selection: RangeSelection): TextNode | ElementNode => {
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

interface EditorToolbarProps {
  editorIsFocused: boolean;
}

const toggleToolbarState = (
  isActive: boolean,
  format: TextFormatType | "link",
  setToolbarValues: Dispatch<SetStateAction<string[]>>,
  condition?: boolean,
) => {
  if (!condition && isActive) {
    return setToolbarValues((prev) => prev.filter((val) => val !== format));
  } else if (condition && !isActive) {
    return setToolbarValues((prev) => prev.concat(format));
  }
};

const BOLD = "bold";
const ITALIC = "italic";
const UNORDERED = "unordered";
const ORDERED = "ordered";
const LINK = "link";

export const EditorToolbar = ({ editorIsFocused }: EditorToolbarProps) => {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [hasSelectedText, setHasSelectedText] = useState(false);
  const selectors = useUserAgent();

  const [toolbarValues, setToolbarValues] = useState<string[]>([]);

  const isBold = useMemo(() => toolbarValues.includes(BOLD), [toolbarValues]);
  const isItalic = useMemo(() => toolbarValues.includes(ITALIC), [toolbarValues]);
  const isUnorderedList = useMemo(() => toolbarValues.includes(UNORDERED), [toolbarValues]);
  const isOrderedList = useMemo(() => toolbarValues.includes(ORDERED), [toolbarValues]);
  const isLink = useMemo(() => toolbarValues.includes(LINK), [toolbarValues]);

  const osCtrl = useCallback(
    (key: string) => {
      if (selectors?.isMobile) return "";
      return `(${selectors?.isMacOs ? "⌘" : "Ctrl"}+${key})`;
    },
    [selectors?.isMacOs, selectors?.isMobile],
  );

  const linkLabel = useMemo(() => {
    const baseText = t(`markdownEditor.toolbar.link.${isLink ? "active" : "inactive"}`);
    return `${baseText} ${osCtrl("k")}`;
  }, [isLink, osCtrl, t]);

  const insertLink = useCallback(() => {
    if (!isLink) {
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
    if (!isOrderedList) {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }, [editor, isOrderedList]);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection) && editorIsFocused) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
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

      setHasSelectedText(selection.anchor.offset !== selection.focus.offset);

      toggleToolbarState(isBold, BOLD, setToolbarValues, selection.hasFormat(BOLD));
      toggleToolbarState(isItalic, ITALIC, setToolbarValues, selection.hasFormat(ITALIC));

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      toggleToolbarState(isLink, LINK, setToolbarValues, $isLinkNode(node) || $isLinkNode(parent));

      if (elementDOM !== null) {
        const filterList = (val: string) => val !== UNORDERED && val !== ORDERED;
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();

          if (type === "bullet") {
            return !isUnorderedList && setToolbarValues((prev) => prev.filter(filterList).concat(UNORDERED));
          } else {
            return !isOrderedList && setToolbarValues((prev) => prev.filter(filterList).concat(ORDERED));
          }
        } else {
          return setToolbarValues((prev) => prev.filter(filterList));
        }
      }
    }
  }, [editorIsFocused, activeEditor, isBold, isItalic, isLink, isUnorderedList, isOrderedList]);

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

        if (code === "KeyK" && (ctrlKey || metaKey)) {
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
    <StyledToggleGroupRoot multiple value={toolbarValues}>
      <ToggleGroupItem
        value={BOLD}
        variant="tertiary"
        aria-label={`${t(`markdownEditor.toolbar.bold.${isBold ? "active" : "inactive"}`)} ${osCtrl("b")}`}
        title={`${t(`markdownEditor.toolbar.bold.${isBold ? "active" : "inactive"}`)} ${osCtrl("b")}`}
        onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        size="small"
      >
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem
        value={ITALIC}
        variant="tertiary"
        aria-label={`${t(`markdownEditor.toolbar.italic.${isItalic ? "active" : "inactive"}`)} ${osCtrl("i")}`}
        title={`${t(`markdownEditor.toolbar.italic.${isItalic ? "active" : "inactive"}`)} ${osCtrl("i")} `}
        onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        size="small"
      >
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem
        value={UNORDERED}
        variant="tertiary"
        onClick={formatBulletList}
        aria-label={t(`markdownEditor.toolbar.unorderedList.${isUnorderedList ? "active" : "inactive"}`)}
        title={t(`markdownEditor.toolbar.unorderedList.${isUnorderedList ? "active" : "inactive"}`)}
        size="small"
      >
        <ListUnordered />
      </ToggleGroupItem>
      <ToggleGroupItem
        variant="tertiary"
        onClick={formatNumberedList}
        aria-label={t(`markdownEditor.toolbar.orderedList.${isOrderedList ? "active" : "inactive"}`)}
        title={t(`markdownEditor.toolbar.orderedList.${isOrderedList ? "active" : "inactive"}`)}
        size="small"
        value={ORDERED}
      >
        <ListOrdered />
      </ToggleGroupItem>
      <ToggleGroupItem
        variant="tertiary"
        onClick={insertLink}
        aria-label={linkLabel}
        title={linkLabel}
        size="small"
        value={LINK}
      >
        <LinkMedium />
      </ToggleGroupItem>
    </StyledToggleGroupRoot>
  );
};
