/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PlateElementProps } from "@udecode/plate/react";
import { PlateElement } from "../components/PlateElement";

export const SectionElement = ({ children, ...props }: PlateElementProps) => {
  return (
    <PlateElement {...props} asChild>
      <section>{children}</section>
    </PlateElement>
  );
};
