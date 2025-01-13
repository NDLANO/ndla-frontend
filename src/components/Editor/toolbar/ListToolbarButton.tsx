/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useListToolbarButton, useListToolbarButtonState } from "@udecode/plate-list/react";
import { IconButton, IconButtonProps } from "@ndla/primitives";

interface Props extends IconButtonProps {
  nodeType: string;
}

export const ListToolbarButton = ({ nodeType, variant = "tertiary", size = "small", ...rest }: Props) => {
  const state = useListToolbarButtonState({ nodeType });
  const {
    props: { pressed, ...props },
  } = useListToolbarButton(state);

  return <IconButton variant={variant} data-state={pressed ? "on" : undefined} size={size} {...props} {...rest} />;
};
