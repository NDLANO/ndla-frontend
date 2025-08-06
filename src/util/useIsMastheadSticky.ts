/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";

export const useIsMastheadSticky = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const masthead = document.getElementById("masthead");
    if (!masthead) return;
    const mediaQuery = window.matchMedia("(max-resolution: 3x)");
    setIsSticky(getComputedStyle(masthead).position === "sticky");
    mediaQuery.onchange = () => {
      setIsSticky(getComputedStyle(masthead).position === "sticky");
    };
  }, []);

  return isSticky;
};
