/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Node, Transforms } from "slate";
import { DOMEditor } from "slate-dom";
import { RenderElementProps, useSlate } from "slate-react";
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
  const { t } = useTranslation();
  const editor = useSlate();
  const ref = useRef<HTMLDivElement>(null);
  const popover = useEditorPopover({ initialFocusEl: () => ref.current });

  return (
    <DialogRoot onExitComplete={() => DOMEditor.focus(editor)}>
      <DialogContext>
        {(context) => (
          <PopoverRootProvider
            value={popover}
            onExitComplete={() => (context.open ? undefined : DOMEditor.focus(editor))}
          >
            <PopoverTrigger asChild consumeCss>
              <a {...attributes} href={element.data.href} target={element.data.target} tabIndex={0}>
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
                  <SafeLink to={element.data.href} target={element.data.target}>
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
                        DOMEditor.focus(editor);
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
        <LinkDialogContent initialValue={{ url: element.data.href, text: Node.string(element) }} />
      </Portal>
    </DialogRoot>
  );
};
