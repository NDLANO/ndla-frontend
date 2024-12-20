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
  LexicalNode,
} from "lexical";
import { Dispatch, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { $isLinkNode, $isAutoLinkNode, toggleLink, $createLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister, $findMatchingParent } from "@lexical/utils";
import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { getSelectedNode } from "./EditorToolbar";

const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;

export const ADD_LINK_COMMAND: LexicalCommand<null> = createCommand();

const FloatingContainer = styled("div", {
  base: {
    position: "absolute",
    zIndex: "popover",
    display: "none",
    alignItems: "end",
    gap: "xsmall",
    backgroundColor: "surface.default",
    border: "1px solid",
    borderColor: "stroke.info",
    borderRadius: "xsmall",
    padding: "xsmall",

    "&[data-visible='true']": {
      display: "flex",
      flexDirection: "column",
      transform: "translate(0, -100px)",
    },
  },
});

const ButtonRow = styled("div", {
  base: {
    width: "100%",
    gap: "xsmall",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
});

const setFloatingElemPositionForLinkEditor = (
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET,
) => {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = "0";
    floatingElem.style.transform = "translate(-10000px, -10000px)";
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  let top = targetRect.top - verticalGap;
  let left = targetRect.left - horizontalOffset;

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height;
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }
  top -= anchorElementRect.top + floatingElemRect.height / 1.5 - verticalGap * 2;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = "1";
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
};

interface FloatingLinkEditorProps {
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElement: HTMLElement;
  editorIsFocused?: boolean;
}

type LexicalSelection = RangeSelection | GridSelection | NodeSelection | null;

const SUPPORTED_URL_PROTOCOLS = ["http:", "https:"];

const sanitizeUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    if (!SUPPORTED_URL_PROTOCOLS.includes(parsedUrl.protocol)) {
      return "about:blank";
    }
  } catch {
    return url;
  }
  return url;
};

const VALID_URL_PROTOCOLS = ["http:", "https:", "mailto:"];

const validateUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return VALID_URL_PROTOCOLS.includes(parsedUrl.protocol);
  } catch (_) {
    return false;
  }
};

const FloatingLinkEditor = ({ editor, isLink, setIsLink, anchorElement, editorIsFocused }: FloatingLinkEditorProps) => {
  const { t } = useTranslation();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [editedLinkElement, setEditedLinkElement] = useState<LexicalNode | null>(null);
  const [editedLinkText, setEditedLinkText] = useState("");
  const [editedLinkUrl, setEditedLinkUrl] = useState("");
  const [lastSelection, setLastSelection] = useState<LexicalSelection>(null);
  const [open, setOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const urlError = useMemo(() => {
    setShowErrorMessage(false);
    if (editedLinkUrl === "") {
      return t("markdownEditor.link.error.url.empty");
    } else if (!validateUrl(editedLinkUrl)) {
      return t("markdownEditor.link.error.url.invalid");
    } else return undefined;
  }, [editedLinkUrl, t]);

  const textError = useMemo(() => {
    setShowErrorMessage(false);
    if (editedLinkText === "") {
      return t("markdownEditor.link.error.text.empty");
    } else return undefined;
  }, [editedLinkText, t]);

  const isDirty = useMemo(() => {
    return editedLinkUrl !== linkUrl || editedLinkText !== linkText;
  }, [editedLinkUrl, editedLinkText, linkUrl, linkText]);

  const closeLinkWindow = () => {
    setEditedLinkText("");
    setEditedLinkUrl("");
    setLinkText("");
    setLinkUrl("");
    setEditedLinkElement(null);
    setLastSelection(null);
    setShowErrorMessage(false);
    setOpen(false);
  };

  const updateLinkEditor = useCallback(() => {
    if (!editorIsFocused) {
      return;
    }
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      let linkNode = undefined;
      if (linkParent) {
        linkNode = linkParent;
      } else if ($isLinkNode(node)) {
        linkNode = node;
      }

      let linkUrl = undefined,
        linkText = undefined;
      if (linkNode) {
        linkUrl = linkNode.getURL();
        linkText = linkNode.getFirstChild()?.getTextContent();
        setEditedLinkElement(linkNode);
      }

      setLinkUrl(linkUrl ?? "");
      setLinkText(linkText ?? "");
      if (!selection.is(lastSelection)) {
        setOpen(linkUrl);
        if (linkUrl) {
          setEditedLinkUrl(linkUrl);
        }
        if (linkText) {
          setEditedLinkText(linkText);
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
      const domRect = nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      if (domRect) {
        domRect.y += 40;
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElement);
      }
      setLastSelection(selection);
    } else if (!activeElement || !activeElement.hasAttribute("data-link-input")) {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElement);
      }
      setLastSelection(null);
      setOpen(false);
      setEditedLinkUrl("");
      setEditedLinkText("");
      setLinkUrl("");
      setLinkText("");
    }

    return true;
  }, [anchorElement, editor, lastSelection, editorIsFocused]);

  useEffect(() => {
    const scrollerElem = anchorElement.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };

    window.addEventListener("resize", update);

    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);

      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
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
        () => {
          const selection = $getSelection();
          setLastSelection(null);
          setEditedLinkElement(null);
          setEditedLinkUrl("");
          setEditedLinkText(selection?.getTextContent() ?? "");
          setLinkUrl("");
          setLinkText("");
          setOpen(true);
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
    if (event.key === "Enter") {
      event.stopPropagation();
      event.preventDefault();
      handleLinkSubmission();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      editor.focus();
    }
  };

  const handleLinkSubmission = () => {
    setShowErrorMessage(true);

    if (!(!isDirty || !!urlError || !!textError)) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const parent = getSelectedNode(selection).getParent();
          let linkElement = editedLinkElement;
          if (parent && $isAutoLinkNode(parent)) {
            const linkNode = $createLinkNode(parent.getURL(), {
              rel: parent.__rel,
              target: parent.__target,
              title: parent.__title,
            });
            parent.replace(linkNode, true);
            linkElement = linkNode;
            setEditedLinkElement(linkNode);
          }
          if (linkElement) {
            linkElement.setURL(sanitizeUrl(editedLinkUrl));
            linkElement.getFirstChild().setTextContent(editedLinkText);
            setTimeout(() => editor.focus());
          } else {
            selection.removeText();
            selection.insertRawText(editedLinkText);
            toggleLink(sanitizeUrl(editedLinkUrl));
          }
        }
      });
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, editedLinkUrl);
      closeLinkWindow();
    }
  };

  const handleLinkDeletion = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        toggleLink(null);
        let validUrl = false;
        try {
          new URL(node.getTextContent());
          validUrl = true;
        } catch (_) {
          validUrl = false;
        }
        if (validUrl) {
          node.remove();
        }
      }
    });
    closeLinkWindow();
  };

  const leftButton = editedLinkElement ? (
    <Button variant="secondary" onClick={handleLinkDeletion}>
      {t("myNdla.resource.remove")}
    </Button>
  ) : (
    <Button variant="secondary" onClick={closeLinkWindow}>
      {t("close")}
    </Button>
  );

  return open ? (
    <FloatingContainer ref={editorRef} data-visible={!!open}>
      <Stack>
        <FieldRoot required invalid={!!showErrorMessage && !!textError}>
          <FieldLabel>{t("markdownEditor.link.text")}</FieldLabel>
          <FieldErrorMessage data-disabled={editedLinkText.length < 1}>
            {!!showErrorMessage && textError}
          </FieldErrorMessage>
          <FieldInput
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={!linkUrl}
            name="text"
            value={editedLinkText}
            onChange={(event) => {
              setEditedLinkText(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              monitorInputInteraction(event);
            }}
          />
        </FieldRoot>
        <FieldRoot required invalid={!!showErrorMessage && !!urlError}>
          <FieldLabel>{t("markdownEditor.link.url")}</FieldLabel>
          <FieldErrorMessage data-disabled={editedLinkUrl.length < 1}>
            {!!showErrorMessage && urlError}
          </FieldErrorMessage>
          <FieldInput
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
        </FieldRoot>
      </Stack>
      <ButtonRow>
        {leftButton}
        <Button variant="primary" onClick={handleLinkSubmission}>
          {t("save")}
        </Button>
      </ButtonRow>
    </FloatingContainer>
  ) : null;
};

interface Props {
  anchorElement: HTMLElement;
  editorIsFocused: boolean;
}

export const FloatingLinkEditorPlugin = ({ anchorElement, editorIsFocused }: Props) => {
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
              window.open(linkNode.getURL(), "_blank");
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
      editorIsFocused={editorIsFocused}
    />,
    anchorElement,
  );
};
