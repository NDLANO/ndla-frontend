/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";

declare module "react-helmet-async" {
  export interface HelmetDatum {
    toString(): string;
    toComponent(): ReactNode;
  }
}
