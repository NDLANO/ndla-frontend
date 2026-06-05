/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const SKEW_RELOAD_KEY = "ndla_skew_reloaded";

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "ChunkLoadError" ||
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("error loading dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  );
}

export function hadChunkReloadAttempt(): boolean {
  return sessionStorage.getItem(SKEW_RELOAD_KEY) === "1";
}

export function triggerCrashReload(): void {
  sessionStorage.setItem(SKEW_RELOAD_KEY, "1");
  window.location.reload();
}

export function consumeReloadGuard(): void {
  sessionStorage.removeItem(SKEW_RELOAD_KEY);
}

export function initSkewDetection(localBuildId: string, signal?: AbortSignal) {
  if (!localBuildId || localBuildId === "SNAPSHOT") return;

  let skewDetected = false;
  let checking = false;

  const checkBuildId = async () => {
    if (checking) return;
    checking = true;
    try {
      const res = await fetch("/build-id");
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
      const { buildId }: { buildId: string } = await res.json();
      if (buildId && buildId !== "SNAPSHOT" && buildId !== localBuildId) {
        skewDetected = true;
      }
    } catch {
      // Network error - ignore
    } finally {
      checking = false;
    }
  };

  document.addEventListener(
    "visibilitychange",
    () => {
      if (!skewDetected && document.visibilityState === "visible") checkBuildId();
    },
    { signal },
  );

  // Intercept forward SPA navigations by patching pushState.
  // React Router (and all SPA routers) call history.pushState for every client-side navigation,
  // so this catches programmatic navigate() calls and <Link> clicks alike.
  const originalPushState = history.pushState.bind(history);
  history.pushState = function (state: unknown, title: string, url?: string | URL | null) {
    if (skewDetected && url != null) {
      window.location.href = url.toString();
      return;
    }
    originalPushState(state, title, url);
  };

  // Back/forward navigations bypass pushState and fire popstate instead.
  // The URL has already changed when popstate fires, so reloading picks up the right page.
  window.addEventListener(
    "popstate",
    () => {
      if (skewDetected) window.location.reload();
    },
    { signal },
  );
}
