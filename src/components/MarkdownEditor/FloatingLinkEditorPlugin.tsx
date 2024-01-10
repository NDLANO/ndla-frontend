/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  GridSelection,
  NodeSelection,
  RangeSelection,
  LexicalCommand,
  createCommand,
  $createTextNode,
  $getRoot,
  $createParagraphNode,
} from 'lexical';
import {
  Dispatch,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { $isLinkNode, $createLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister, $findMatchingParent } from '@lexical/utils';
import { ButtonV2 } from '@ndla/button';
import { colors, misc, shadows, spacing } from '@ndla/core';
import { FieldErrorMessage, FormControl, InputV3, Label } from '@ndla/forms';
import { getSelectedNode } from './EditorToolbar';

const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;

export const ADD_LINK_COMMAND: LexicalCommand<null> = createCommand();

const FloatingContainer = styled.div`
  position: absolute;
  z-index: 1000;
  display: none;
  align-items: center;
  gap: ${spacing.small};
  background-color: ${colors.white};
  border: 1px solid ${colors.brand.greyLight};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.small};
  box-shadow: ${shadows.levitate1};
  &[data-visible='true'] {
    display: flex;
  }
`;
const InputWrapperWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;
const InputWrapper = styled.div`
  display: flex;
  align-items: left;
  flex-direction: column;
`;

export const setFloatingElemPositionForLinkEditor = (
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET,
) => {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  let top = targetRect.top - verticalGap;
  let left = targetRect.left - horizontalOffset;

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height + verticalGap * 2;
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }

  top -= anchorElementRect.top;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = '1';
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
};

interface FloatingLinkEditorProps {
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElement: HTMLElement;
}

type LexicalSelection = RangeSelection | GridSelection | NodeSelection | null;

const SUPPORTED_URL_PROTOCOLS = ['http:', 'https:'];

const sanitizeUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    if (!SUPPORTED_URL_PROTOCOLS.includes(parsedUrl.protocol)) {
      return 'about:blank';
    }
  } catch {
    return url;
  }
  return url;
};

const VALID_URL_PROTOCOLS = ['http:', 'https:'];

const validateUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return VALID_URL_PROTOCOLS.includes(parsedUrl.protocol);
  } catch (_) {
    return false;
  }
};

const FloatingLinkEditor = ({
  editor,
  isLink,
  setIsLink,
  anchorElement,
}: FloatingLinkEditorProps) => {
  const { t } = useTranslation();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [editedLinkText, setEditedLinkText] = useState('');
  const [editedLinkUrl, setEditedLinkUrl] = useState('');
  const [lastSelection, setLastSelection] = useState<LexicalSelection>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const error = useMemo(() => {
    if (editedLinkUrl === '') {
      return t('markdownEditor.link.error.empty');
    } else if (!validateUrl(editedLinkUrl)) {
      return t('markdownEditor.link.error.invalid');
    } else return undefined;
  }, [editedLinkUrl, t]);
  const isDirty = editedLinkUrl !== linkUrl;

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      let linkUrl = undefined;
      if (linkParent) {
        linkUrl = linkParent.getURL();
      } else if ($isLinkNode(node)) {
        linkUrl = node.getURL();
      }

      setLinkUrl(linkUrl ?? '');
      if (!selection.is(lastSelection)) {
        setIsLinkEditMode(linkUrl);
        if (linkUrl) {
          setEditedLinkUrl(linkUrl);
        }
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement?.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      if (domRect) {
        domRect.y += 40;
        setFloatingElemPositionForLinkEditor(
          domRect,
          editorElem,
          anchorElement,
        );
      }
      setLastSelection(selection);
    } else if (
      !activeElement ||
      !activeElement.hasAttribute('data-link-input')
    ) {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElement);
      }
      setLastSelection(null);
      setIsLinkEditMode(false);
      setEditedLinkUrl('');
      setLinkUrl('');
    }

    return true;
  }, [anchorElement, editor, lastSelection]);

  useEffect(() => {
    const scrollerElem = anchorElement.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };

    window.addEventListener('resize', update);

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);

      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [anchorElement.parentElement, editor, updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        ADD_LINK_COMMAND,
        (_) => {
          setLastSelection(null);
          setEditedLinkUrl('');
          setLinkUrl('');
          setIsLinkEditMode(true);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, updateLinkEditor, setIsLink, isLink]);

  const monitorInputInteraction = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLinkSubmission();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsLinkEditMode(false);
      editor.focus();
    }
  };

  const handleLinkSubmission = () => {
    editor.update(() => {
      const root = $getRoot();
      const selection = $getSelection();

      const textNode = $createTextNode(editedLinkText);
      const linkNode = $createLinkNode(sanitizeUrl(editedLinkUrl));
      linkNode.append(textNode);

      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        parent?.append(linkNode);
      } else {
        const paragraphNode = $createParagraphNode();
        paragraphNode.append(linkNode);
        root.append(paragraphNode);
      }
    });
    setLastSelection(null);
    setEditedLinkUrl('');
    setEditedLinkText('');
    setLinkUrl('');
    setIsLinkEditMode(false);
  };

  return isLinkEditMode ? (
    <FloatingContainer ref={editorRef} data-visible={!!isLinkEditMode}>
      <FormControl id="url" isRequired isInvalid={!!error}>
        <InputWrapperWrapper>
          <InputWrapper>
            <Label margin="none" textStyle="label-small">
              Lenketekst
            </Label>
            <InputV3
              name="text"
              value={editedLinkText}
              onChange={(event) => {
                setEditedLinkText(event.currentTarget.value);
              }}
            />
            <FieldErrorMessage>
              Lenketeksten kan ikke være tom
            </FieldErrorMessage>
          </InputWrapper>
          <InputWrapper>
            <Label margin="none" textStyle="label-small">
              {t('markdownEditor.link.url')}
            </Label>
            <InputV3
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              name="url"
              ref={inputRef}
              data-link-input=""
              value={editedLinkUrl}
              onChange={(event) => {
                setEditedLinkUrl(event.currentTarget.value);
              }}
              onKeyDown={(event) => {
                monitorInputInteraction(event);
              }}
            />
            <FieldErrorMessage>{error}</FieldErrorMessage>
          </InputWrapper>
        </InputWrapperWrapper>
        <ButtonV2 onClick={handleLinkSubmission} disabled={!isDirty || !!error}>
          {t('save')}
        </ButtonV2>
      </FormControl>
    </FloatingContainer>
  ) : null;
};

interface Props {
  anchorElement: HTMLElement;
}

export const FloatingLinkEditorPlugin = ({ anchorElement }: Props) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    const updateToolbar = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const linkParent = $findMatchingParent(node, $isLinkNode);
        setIsLink(linkParent !== null);
      }
    };
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank');
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      anchorElement={anchorElement}
      setIsLink={setIsLink}
    />,
    anchorElement,
  );
};
