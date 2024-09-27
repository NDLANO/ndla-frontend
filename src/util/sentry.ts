/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Sentry from "@sentry/react";
import { ConfigType } from "../config";

export const initSentry = (config: ConfigType) => {
  Sentry.init({
    dsn: config.sentrydsn,
    environment: config.ndlaEnvironment,
    integrations: [],
  });
};
