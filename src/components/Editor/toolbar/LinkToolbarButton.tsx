/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLinkToolbarButton, useLinkToolbarButtonState } from "@udecode/plate-link/react";
import { IconButton, IconButtonProps } from "@ndla/primitives";

interface Props extends IconButtonProps {}

export const LinkToolbarButton = ({ children, variant = "tertiary", size = "small", ...rest }: Props) => {
  const state = useLinkToolbarButtonState();
  const {
    props: { pressed, ...props },
  } = useLinkToolbarButton(state);

  return (
    <IconButton size={size} variant={variant} data-state={pressed ? "on" : undefined} {...props} {...rest}>
      {children}
    </IconButton>
  );
};
