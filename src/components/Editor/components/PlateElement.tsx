/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Box, PlateElementProps, usePlateElement } from "@udecode/plate/react";

// The version of PlateElement found in plate automatically adds a class name. This messes with our global styling.

export const PlateElement = (props: PlateElementProps) => {
  const { props: rootProps, ref: rootRef } = usePlateElement({
    ...props,
  });
  const { className, style, ...rest } = rootProps;

  return <Box {...rest} ref={rootRef} />;
};
