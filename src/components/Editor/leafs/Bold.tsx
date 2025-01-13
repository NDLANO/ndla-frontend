/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PlateLeafProps } from "@udecode/plate/react";
import { PlateLeaf } from "../components/PlateLeaf";

export const BoldLeaf = ({ children, ...props }: PlateLeafProps) => {
  return (
    <PlateLeaf {...props} asChild>
      <strong>{children}</strong>
    </PlateLeaf>
  );
};
