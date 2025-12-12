/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Request } from "express";
import config from "../../config";

export const disableSSR = (req: Request) => {
  if (req.query.disableSSR) {
    return req.query.disableSSR === "true";
  }
  return config.disableSSR;
};
