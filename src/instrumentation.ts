/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// NOTE: This module MUST be imported before anything else (especially http/express) so the OpenTelemetry
// instrumentations can patch Node's built-in `http` and `undici` (global `fetch`) before they are first
// used. See the first import in `server.ts`. The SDK runs process-wide, so the separate SSR render bundle
// (server.render.ts) is instrumented too.

import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { NodeSDK, tracing } from "@opentelemetry/sdk-node";

const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const tracesExporter = process.env.OTEL_TRACES_EXPORTER;
const enabled = Boolean(otlpEndpoint || tracesExporter);

let sdk: NodeSDK | undefined;

if (enabled) {
  const traceExporter = tracesExporter === "console" ? new tracing.ConsoleSpanExporter() : new OTLPTraceExporter();

  sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": { enabled: false },
      }),
    ],
  });

  sdk.start();
}

export { sdk };
