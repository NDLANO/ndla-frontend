/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PlateLeafProps, Text, usePlateLeaf } from "@udecode/plate/react";

// The version of PlateLeaf found in plate automatically adds a class name. This messes with our global styling.

export const PlateLeaf = (props: PlateLeafProps) => {
  const { props: rootProps, ref: rootRef } = usePlateLeaf({ ...props });
  const { className, ...rest } = rootProps;
  return <Text {...rest} ref={rootRef} />;
};
