/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  const mediaQuery = window.matchMedia("(max-resolution: 3x)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getSnapshot = () => {
  const masthead = document.getElementById("masthead");
  if (!masthead) return false;
  return getComputedStyle(masthead).position === "sticky";
};

const getServerSnapshot = () => false;

export const useIsMastheadSticky = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
