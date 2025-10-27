/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext } from "react";

export interface ResponseInfo {
  status?: number;
}

export const ResponseContext = createContext<ResponseInfo | undefined>(undefined);
