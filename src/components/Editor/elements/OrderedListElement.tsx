/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PlateElementProps } from "@udecode/plate/react";
import { OrderedList } from "@ndla/primitives";
import { PlateElement } from "../components/PlateElement";

export const OrderedListElement = ({ children, ...props }: PlateElementProps) => {
  return (
    <PlateElement {...props} asChild>
      <OrderedList>{children}</OrderedList>
    </PlateElement>
  );
};
