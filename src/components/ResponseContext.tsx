/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext } from "react";

export class ResponseInfo {
  status?: number;

  constructor(status?: number) {
    this.status = status;
  }

  isAccessDeniedError(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

const ResponseContext = createContext<ResponseInfo | undefined>(undefined);
export default ResponseContext;
