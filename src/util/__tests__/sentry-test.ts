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

// Network failures phrased per-browser, with the " (host)" suffix Sentry appends, plus the
// "Request timeout " accessibility-tooling class. All should be dropped regardless of suffix.
const droppedNetworkErrors = [
  new TypeError("Failed to fetch (api.ndla.no)"), // Chromium + host suffix
  new TypeError("Load failed (api.ndla.no)"), // Safari
  new TypeError("NetworkError when attempting to fetch resource. (api.ndla.no)"), // Firefox
  new Error("[Network error]: Failed to fetch (api.ndla.no)"), // Apollo prefix + host suffix
  new Error("Request timeout isOcrAvailable"), // a "Request timeout" variant not in the old hardcoded list
];

test("beforeSend drops network/timeout noise regardless of host suffix or browser phrasing", () => {
  droppedNetworkErrors.forEach((error) => {
    const result = beforeSend({} as ErrorEvent, { originalException: error } as EventHint);
    expect(result).toBe(null);
  });
});

test("beforeSend drops a 'Request timeout' surfaced as a non-Error rejection (event value only)", () => {
  const event = {
    exception: {
      values: [{ value: "Non-Error promise rejection captured with value: Request timeout isOcrAvailable" }],
    },
  } as ErrorEvent;
  expect(beforeSend(event, {} as EventHint)).toBe(null);
});

test("beforeSend unwraps a CustomEvent rejection whose real cause is a network error", () => {
  const event = {
    exception: { values: [{ value: "Non-Error promise rejection captured with value: [object CustomEvent]" }] },
  } as ErrorEvent;
  const hint = { originalException: { detail: { reason: new TypeError("Load failed (api.ndla.no)") } } } as EventHint;
  expect(beforeSend(event, hint)).toBe(null);
});

// Things that must NOT be dropped — they need to reach Sentry.
test("beforeSend keeps chunk-load errors (skewDetection needs them) and ordinary app errors", () => {
  const chunkEvent = {} as ErrorEvent;
  const chunkLoad = new TypeError("Failed to fetch dynamically imported module: /static/WelcomePage-DgfLJsrO.js");
  expect(beforeSend(chunkEvent, { originalException: chunkLoad } as EventHint)).toBe(chunkEvent);

  const appEvent = {} as ErrorEvent;
  const appError = new Error("Cannot read properties of undefined (reading 'foo')");
  expect(beforeSend(appEvent, { originalException: appError } as EventHint)).toBe(appEvent);
});
