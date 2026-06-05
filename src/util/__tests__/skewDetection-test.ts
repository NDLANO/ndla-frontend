/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  consumeReloadGuard,
  hadChunkReloadAttempt,
  initSkewDetection,
  isChunkLoadError,
  triggerCrashReload,
} from "../skewDetection";

// Replace window.location with a plain object so reload/href are writable.
// jsdom's Location is non-configurable on individual properties, but the
// window.location property itself is configurable.
const mockLocation = { reload: vi.fn(), href: "http://localhost/" };
Object.defineProperty(window, "location", { configurable: true, value: mockLocation });

const jsonResponse = (buildId: string) =>
  Promise.resolve({
    ok: true,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => ({ buildId }),
  });

describe("isChunkLoadError", () => {
  it("detects Vite dynamic import failure", () => {
    expect(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: /assets/foo.abc.js"))).toBe(
      true,
    );
  });

  it("detects older Vite phrasing", () => {
    expect(isChunkLoadError(new Error("error loading dynamically imported module"))).toBe(true);
  });

  it("detects Safari/Firefox phrasing", () => {
    expect(isChunkLoadError(new Error("Importing a module script failed"))).toBe(true);
  });

  it("detects webpack ChunkLoadError by error name", () => {
    const err = new Error("Loading chunk 12 failed");
    err.name = "ChunkLoadError";
    expect(isChunkLoadError(err)).toBe(true);
  });

  it("returns false for ordinary errors", () => {
    expect(isChunkLoadError(new Error("Something went wrong"))).toBe(false);
    expect(isChunkLoadError(new TypeError("Cannot read property 'x' of undefined"))).toBe(false);
  });

  it("returns false for non-Error values", () => {
    expect(isChunkLoadError("string error")).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
  });
});

describe("reload guard", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockLocation.reload.mockReset();
  });

  it("hadChunkReloadAttempt returns false when no guard is set", () => {
    expect(hadChunkReloadAttempt()).toBe(false);
  });

  it("triggerCrashReload sets the guard and calls reload", () => {
    triggerCrashReload();
    expect(sessionStorage.getItem("ndla_skew_reloaded")).toBe("1");
    expect(mockLocation.reload).toHaveBeenCalledOnce();
  });

  it("hadChunkReloadAttempt returns true after triggerCrashReload", () => {
    triggerCrashReload();
    expect(hadChunkReloadAttempt()).toBe(true);
  });

  it("consumeReloadGuard clears the guard", () => {
    triggerCrashReload();
    consumeReloadGuard();
    expect(hadChunkReloadAttempt()).toBe(false);
  });
});

describe("initSkewDetection", () => {
  let controller: AbortController;
  let originalPushState: typeof history.pushState;

  beforeEach(() => {
    controller = new AbortController();
    originalPushState = history.pushState;
    vi.stubGlobal("fetch", vi.fn());
    mockLocation.reload.mockReset();
    mockLocation.href = "http://localhost/";
  });

  afterEach(() => {
    controller.abort();
    history.pushState = originalPushState;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const triggerVisibilityChange = () => {
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  };

  const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

  it("does nothing when buildId is SNAPSHOT", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    initSkewDetection("SNAPSHOT", controller.signal);
    triggerVisibilityChange();
    await flush();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches /build-id when tab becomes visible", async () => {
    const fetchMock = vi.fn().mockImplementation(() => jsonResponse("v1"));
    vi.stubGlobal("fetch", fetchMock);

    initSkewDetection("v1", controller.signal);
    triggerVisibilityChange();
    await flush();

    expect(fetchMock).toHaveBeenCalledWith("/build-id");
  });

  it("does not intercept pushState when build IDs match", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => jsonResponse("v1")),
    );
    const originalSpy = vi.fn();
    history.pushState = originalSpy;

    initSkewDetection("v1", controller.signal);
    triggerVisibilityChange();
    await flush();

    history.pushState({}, "", "/some-page");
    expect(originalSpy).toHaveBeenCalledWith({}, "", "/some-page");
    expect(mockLocation.href).toBe("http://localhost/");
  });

  it("redirects via location.href instead of pushState when skew is detected", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => jsonResponse("v2")),
    );

    initSkewDetection("v1", controller.signal);
    triggerVisibilityChange();
    await flush();

    history.pushState({}, "", "/next-page");
    expect(mockLocation.href).toBe("/next-page");
  });

  it("reloads on popstate when skew is detected", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => jsonResponse("v2")),
    );

    initSkewDetection("v1", controller.signal);
    triggerVisibilityChange();
    await flush();

    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(mockLocation.reload).toHaveBeenCalledOnce();
  });

  it("ignores fetch errors and does not set skewDetected", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
    const originalSpy = vi.fn();
    history.pushState = originalSpy;

    initSkewDetection("v1", controller.signal);
    triggerVisibilityChange();
    await flush();

    history.pushState({}, "", "/some-page");
    expect(originalSpy).toHaveBeenCalled();
    expect(mockLocation.href).toBe("http://localhost/");
  });
});
