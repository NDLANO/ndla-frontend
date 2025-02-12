/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import type { EditorMarks } from "slate";
import { platformSpecificTooltip, useMarkToolbarButton, useMarkToolbarButtonState } from "@ndla/editor-components";
import { IconButton, IconButtonProps } from "@ndla/primitives";

interface MarkToolbarButtonProps extends IconButtonProps {
  mark: keyof EditorMarks;
  shortcut?: string;
}

export const MarkToolbarButton = ({ mark, shortcut, title, ...rest }: MarkToolbarButtonProps) => {
  const { t } = useTranslation();
  const state = useMarkToolbarButtonState({ type: mark });
  const toolbarButton = useMarkToolbarButton(state);
  const tooltip = shortcut
    ? t(`richTextEditor.tooltip.${mark}`, { shortcut: platformSpecificTooltip(shortcut) })
    : undefined;
  return (
    <IconButton
      {...rest}
      size="small"
      variant="tertiary"
      title={title ?? tooltip}
      aria-label={rest["aria-label"] ?? tooltip}
      {...toolbarButton.props}
    />
  );
};
