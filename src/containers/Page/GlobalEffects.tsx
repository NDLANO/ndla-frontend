/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef } from "react";
import { useComponentSize } from "@ndla/hooks";
import { useIsMastheadSticky } from "../../util/useIsMastheadSticky";

export const GlobalEffects = () => {
  const { height } = useComponentSize("masthead");
  const htmlRef = useRef<HTMLHtmlElement | null>(null);
  const isSticky = useIsMastheadSticky();

  useEffect(() => {
    if (!htmlRef.current) {
      htmlRef.current = document.querySelector("html");
      // This defaults to 72px in index.css
    } else if (isSticky && htmlRef.current.style.scrollPaddingTop !== `${height}px`) {
      htmlRef.current.style.scrollPaddingTop = `${height}px`;
    }
    document.documentElement.style.setProperty("--masthead-height", `${height}px`);
  }, [height, isSticky]);

  return null;
};
