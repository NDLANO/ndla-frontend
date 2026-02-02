/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DialogContext, Portal } from "@ark-ui/react";
import { ElementRenderer, isLinkElement, LinkElement as LinkElementType } from "@ndla/editor";
import { InlineBugfix, useEditorPopover } from "@ndla/editor-components";
import { DeleteBinFill, PencilLine } from "@ndla/icons";
import {
  DialogRoot,
  DialogTrigger,
  IconButton,
  PopoverContent,
  PopoverRootProvider,
  PopoverTitle,
  PopoverTrigger,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Node, Selection, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSlate } from "slate-react";
import { LinkDialogContent } from "./LinkDialogContent";

const ActionsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    padding: "xsmall",
  },
});

export const LinkElement: ElementRenderer = (props) => {
  const { element } = props;
  if (element.type !== "link") {
    return undefined;
  }

  return <SlateLink {...props} element={element} />;
};

interface SlateLinkProps extends RenderElementProps {
  element: LinkElementType;
}

const SlateLink = ({ children, element, attributes }: SlateLinkProps) => {
  const [savedSelection, setSavedSelection] = useState<Selection | undefined>(undefined);
  const { t } = useTranslation();
  const editor = useSlate();
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popover = useEditorPopover({ initialFocusEl: () => ref.current, triggerRef });

  return (
    <DialogRoot
      onOpenChange={(details) => {
        if (details.open && editor.selection) {
          setSavedSelection(editor.selection);
        }
      }}
      onExitComplete={() => {
        if (savedSelection) {
          Transforms.setSelection(editor, savedSelection);
          setSavedSelection(undefined);
        }
        const slateEditor = document.querySelector("[data-slate-editor]") as HTMLElement | undefined;
        slateEditor?.focus();
        setTimeout(() => {
          ReactEditor.focus(editor);
        }, 0);
      }}
    >
      <DialogContext>
        {(context) => (
          <PopoverRootProvider
            value={popover}
            onExitComplete={() => {
              if (context.open) return;
              const slateEditor = document.querySelector("[data-slate-editor]") as HTMLElement | undefined;
              slateEditor?.focus();
              setTimeout(() => {
                ReactEditor.focus(editor);
              }, 0);
            }}
          >
            <PopoverTrigger asChild consumeCss {...attributes} ref={triggerRef}>
              <a href={element.data.href} target={element.data.target} rel={element.data.rel}>
                <InlineBugfix />
                {children}
                <InlineBugfix />
              </a>
            </PopoverTrigger>
            <Portal>
              <StyledPopoverContent ref={ref}>
                <PopoverTitle srOnly>
                  {t("richTextEditor.plugin.link.popoverTitle", { domain: element.data.href })}
                </PopoverTitle>
                <ActionsWrapper>
                  <SafeLink to={element.data.href} target={element.data.target} rel={element.data.rel}>
                    {element.data.href}
                  </SafeLink>
                  <DialogTrigger asChild onClick={() => popover.setOpen(false)}>
                    <IconButton variant="secondary" size="small">
                      <PencilLine />
                    </IconButton>
                  </DialogTrigger>
                  <IconButton
                    variant="danger"
                    size="small"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      Transforms.unwrapNodes(editor, { match: isLinkElement });
                      setTimeout(() => {
                        ReactEditor.focus(editor);
                      });
                    }}
                  >
                    <DeleteBinFill />
                  </IconButton>
                </ActionsWrapper>
              </StyledPopoverContent>
            </Portal>
          </PopoverRootProvider>
        )}
      </DialogContext>
      <Portal>
        <LinkDialogContent
          key={Node.string(element)}
          initialValue={{ url: element.data.href, text: Node.string(element) }}
        />
      </Portal>
    </DialogRoot>
  );
};
