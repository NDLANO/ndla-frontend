/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Sentry from "@sentry/react";

export const initSentry = (dsn: string) => {
  Sentry.init({ dsn, integrations: [] });
};
