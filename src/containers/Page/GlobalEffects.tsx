/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useComponentSize } from "@ndla/hooks";
import { usePrevious } from "@ndla/util";
import { useIsMastheadSticky } from "../../util/useIsMastheadSticky";

export const GlobalEffects = () => {
  const { pathname } = useLocation();
  const prevPathname = usePrevious(pathname);
  const { height } = useComponentSize("masthead");
  const htmlRef = useRef<HTMLHtmlElement | null>(null);
  const isSticky = useIsMastheadSticky();

  useEffect(() => {
    if (!prevPathname || pathname === prevPathname) {
      return;
    }
    const searchUpdate = pathname === "/search" && prevPathname === "/search";
    if (!searchUpdate) {
      window.scrollTo(0, 0);
    }
  }, [pathname, prevPathname]);

  useEffect(() => {
    if (!htmlRef.current) {
      htmlRef.current = document.querySelector("html");
    } else if (isSticky) {
      htmlRef.current.style.scrollPaddingTop = `${height}px`;
    }
    document.documentElement.style.setProperty("--masthead-height", `${height}px`);
  }, [height, isSticky]);

  return null;
};
