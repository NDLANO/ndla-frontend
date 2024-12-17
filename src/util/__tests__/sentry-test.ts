/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EventHint, ErrorEvent } from "@sentry/react";
import { beforeSend } from "../sentry";

const knownErrors = [
  new Error("Failed to fetch"),
  new Error("[Network error]: Failed to fetch"),
  new Error('Object.prototype.hasOwnProperty.call(o,"telephone")'),
  new Error('Object.prototype.hasOwnProperty.call(e,"telephone")'),
  new Error("'get' on proxy: property 'javaEnabled' is a read-only and non-configurable data property"),
];

test("beforeSend filters our known errors", () => {
  knownErrors.forEach((error) => {
    const result = beforeSend({} as ErrorEvent, { originalException: error } as EventHint);
    expect(result).toBe(null);
  });
});
