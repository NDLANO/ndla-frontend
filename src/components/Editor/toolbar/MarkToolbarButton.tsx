/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMarkToolbarButton, useMarkToolbarButtonState } from "@udecode/plate/react";
import { IconButton, IconButtonProps } from "@ndla/primitives";

interface MarkToolbarButtonProps extends IconButtonProps {
  nodeType: string;
  clear?: string[] | string;
}

export const MarkToolbarButton = ({
  clear,
  nodeType,
  variant = "tertiary",
  size = "small",
  ...rest
}: MarkToolbarButtonProps) => {
  const state = useMarkToolbarButtonState({ clear, nodeType });
  const {
    props: { pressed, ...props },
  } = useMarkToolbarButton(state);
  return <IconButton variant={variant} data-state={pressed ? "on" : undefined} size={size} {...props} {...rest} />;
};
