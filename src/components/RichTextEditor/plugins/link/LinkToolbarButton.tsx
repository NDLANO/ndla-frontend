/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { isLinkElement } from "@ndla/editor";
import { platformSpecificTooltip } from "@ndla/editor-components";
import { LinkMedium } from "@ndla/icons";
import { DialogRoot, DialogTrigger, IconButton, IconButtonProps } from "@ndla/primitives";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSlate, useSlateSelection } from "slate-react";
import { LinkDialogContent, LinkFormValues, toInitialLinkFormValues } from "./LinkDialogContent";
import { LINK_TOOLBAR_BUTTON_ID } from "./linkUtils";

interface Props extends IconButtonProps {
  shortcut?: string;
}

export const LinkToolbarButton = ({ shortcut, ...rest }: Props) => {
  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState<LinkFormValues | undefined>(undefined);
  const editor = useSlate();
  const selection = useSlateSelection();

  const [match] = editor.nodes({ match: isLinkElement });

  const tooltip = shortcut
    ? t(`richTextEditor.tooltip.link`, { shortcut: platformSpecificTooltip(shortcut) })
    : undefined;

  return (
    <DialogRoot
      onExitComplete={() => setInitialValue(undefined)}
      ids={{
        trigger: LINK_TOOLBAR_BUTTON_ID,
      }}
    >
      <DialogTrigger
        asChild
        onMouseDown={(e) => e.preventDefault()}
        disabled={!selection}
        onClick={() => setInitialValue(toInitialLinkFormValues(match?.[0], editor))}
      >
        <IconButton
          size="small"
          variant="tertiary"
          data-state={match ? "on" : "off"}
          {...rest}
          aria-label={rest["aria-label"] ?? tooltip}
          title={rest.title ?? tooltip}
        >
          <LinkMedium />
        </IconButton>
      </DialogTrigger>
      {!!initialValue && (
        <Portal>
          <LinkDialogContent initialValue={initialValue} />
        </Portal>
      )}
    </DialogRoot>
  );
};
