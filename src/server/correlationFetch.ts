/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getLoggerContextStore } from "./middleware/loggerContextMiddleware";

/** Wrap the global `fetch` so server-side outgoing requests (Apollo to graphql-api, and any other
 * downstream call) carry the request's correlation id, letting it reach downstream logs. The whole request
 * — including the nested SSR render — runs inside `loggerContextMiddleware`'s AsyncLocalStorage scope, so
 * the id is available here. The W3C `traceparent` is added separately and automatically by the
 * OpenTelemetry undici instrumentation, so it is not set here. Must be installed once, server-side, during
 * bootstrap. */
export const installCorrelationIdFetch = (): void => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const correlationID = getLoggerContextStore()?.correlationID;
    if (!correlationID) return originalFetch(input, init);

    // Normalise to a Request so we can mutate headers regardless of how fetch was called.
    const request = new Request(input, init);
    if (!request.headers.has("x-correlation-id")) {
      request.headers.set("x-correlation-id", correlationID);
    }
    return originalFetch(request);
  };
};
