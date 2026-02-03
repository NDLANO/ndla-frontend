/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ListType } from "@ndla/editor";
import { platformSpecificTooltip, useListToolbarButton, useListToolbarButtonState } from "@ndla/editor-components";
import { IconButton, IconButtonProps } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { useSlateSelection } from "slate-react";

interface Props extends IconButtonProps {
  listType: ListType;
  shortcut?: string;
}

export const ListToolbarButton = ({ listType, shortcut, title, ...rest }: Props) => {
  const { t } = useTranslation();
  const selection = useSlateSelection();
  const state = useListToolbarButtonState({ type: listType });
  const toolbarButton = useListToolbarButton(state);
  const tooltip = shortcut
    ? t(`richTextEditor.tooltip.${listType}`, { shortcut: platformSpecificTooltip(shortcut) })
    : undefined;
  return (
    <IconButton
      size="small"
      variant="tertiary"
      disabled={!selection}
      {...toolbarButton.props}
      {...rest}
      title={title ?? tooltip}
      aria-label={rest["aria-label"] ?? tooltip}
    />
  );
};
