/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ListType } from "@ndla/editor";
import { useListToolbarButton, useListToolbarButtonState } from "@ndla/editor-components";
import { IconButton, IconButtonProps } from "@ndla/primitives";

interface Props extends IconButtonProps {
  listType: ListType;
}

export const ListToolbarButton = ({ listType, ...rest }: Props) => {
  const state = useListToolbarButtonState({ type: listType });
  const toolbarButton = useListToolbarButton(state);
  return <IconButton size="small" variant="tertiary" {...toolbarButton.props} {...rest} />;
};
