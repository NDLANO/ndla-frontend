/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ErrorEvent, EventHint, init } from "@sentry/react";
import { ConfigType } from "../config";
import { deriveLogLevel } from "./handleError";

const isInformationalError = (exception: unknown): boolean => {
  const logLevel = deriveLogLevel(exception);
  return logLevel === "info";
};

type SentryIgnore = {
  error: string;
  exact?: boolean;
};

const sentryIgnoreErrors: SentryIgnore[] = [
  // https://github.com/getsentry/sentry/issues/61469
  { error: 'Object.prototype.hasOwnProperty.call(o,"telephone")' },
  { error: 'Object.prototype.hasOwnProperty.call(e,"telephone")' },
  // https://github.com/matomo-org/matomo/issues/22836
  { error: "'get' on proxy: property 'javaEnabled' is a read-only and non-configurable data property" },
  { error: "Object Not Found Matching Id" },
];

// Network failures phrased differently per browser. Sentry's fetch instrumentation appends a
// " (host)" suffix and Apollo prefixes "[Network error]: ", so strip those before matching. We
// compare against the EXACT stem (not `includes`) so chunk-load errors such as
// "Failed to fetch dynamically imported module: ..." are left for skewDetection to handle.
const networkErrorStems = [
  "Failed to fetch", // Chromium
  "Load failed", // Safari
  "NetworkError when attempting to fetch resource.", // Firefox
];

const isNetworkError = (message: string): boolean => {
  const stripped = message
    .replace(/^\[Network error\]:\s*/, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
  return networkErrorStems.includes(stripped);
};

// ChromeOS accessibility tooling emits a steady stream of "Request timeout <thing>" errors. Match the
// whole class by prefix instead of enumerating every variant (and `includes` so it also matches the
// "Non-Error promise rejection captured with value: " wrapper Sentry adds for non-Error rejections).
const isRequestTimeout = (message: string): boolean => message.includes("Request timeout ");

// Non-Error rejections (e.g. a CustomEvent) hide the real cause under `.reason`/`.detail.reason`, so the
// top-level event message is opaque. Dig it out so the network/timeout filters can still match.
const extractRejectionMessage = (originalException: unknown): string | undefined => {
  if (originalException == null || typeof originalException !== "object") return undefined;
  const obj = originalException as { reason?: unknown; detail?: { reason?: unknown } };
  const reason = obj.reason ?? obj.detail?.reason;
  if (typeof reason === "string") return reason;
  if (reason && typeof reason === "object" && typeof (reason as { message?: unknown }).message === "string") {
    return (reason as { message: string }).message;
  }
  return undefined;
};

export const beforeSend = (event: ErrorEvent, hint: EventHint) => {
  const exception = hint.originalException;
  const infoError = isInformationalError(exception);
  if (infoError) return null;

  const message =
    event.message || event?.exception?.values?.[0]?.value || (hint?.originalException as Error | undefined)?.message;

  // Drop unactionable network/timeout noise. Check both the primary message and any unwrapped
  // rejection reason so non-Error rejections (whose `message` is opaque) are still caught.
  const rejectionMessage = extractRejectionMessage(hint?.originalException);
  const candidateMessages = [message, rejectionMessage].filter((m): m is string => typeof m === "string");
  if (candidateMessages.some((m) => isNetworkError(m) || isRequestTimeout(m))) {
    return null;
  }

  if (typeof message !== "string") return event;

  // Extension error filtering
  const frames = event?.exception?.values?.[0]?.stacktrace?.frames || [];
  const hasExtensionFrame = frames.some((frame) => {
    const filename = frame?.filename || "";
    return (
      filename.startsWith("chrome-extension://") ||
      filename.startsWith("moz-extension://") ||
      filename.includes("extensions::")
    );
  });

  const isExtensionError =
    hasExtensionFrame || message.includes("chrome-extension://") || message.includes("moz-extension://");

  if (isExtensionError) return null;

  const ignoreEntry = sentryIgnoreErrors.find((ignoreEntry) => {
    if (ignoreEntry.exact) {
      return message === ignoreEntry.error;
    }
    return message.includes(ignoreEntry.error);
  });

  if (ignoreEntry) {
    // https://github.com/getsentry/sentry-javascript/issues/3440
    // https://github.com/getsentry/sentry/issues/61469
    // https://github.com/matomo-org/matomo/issues/22836
    return null;
  }

  // OneNote can fail in a million ways. They are probably not our problem.
  if (document.referrer && document.referrer.includes("noc-onenote.officeapps.live.com")) {
    return null;
  }

  return event;
};

export const initSentry = (config: ConfigType) => {
  if (config.ndlaEnvironment === "local" || config.ndlaEnvironment === "dev") {
    // Skipping sentry initialization in local and dev environments
    return;
  }

  const release = `${config.componentName}@${config.componentVersion}`;

  init({
    dsn: config.sentrydsn,
    environment: config.ndlaEnvironment,
    normalizeDepth: 20,
    release,
    beforeSend,
    integrations: [],
  });
};
