/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorMarks } from "slate";
import { useMarkToolbarButton, useMarkToolbarButtonState } from "@ndla/editor-components";
import { IconButton, IconButtonProps } from "@ndla/primitives";

interface MarkToolbarButtonProps extends IconButtonProps {
  mark: keyof EditorMarks;
}

export const MarkToolbarButton = ({ mark, ...rest }: MarkToolbarButtonProps) => {
  const state = useMarkToolbarButtonState({ type: mark });
  const toolbarButton = useMarkToolbarButton(state);
  return <IconButton size="small" variant="tertiary" {...toolbarButton.props} {...rest} />;
};
