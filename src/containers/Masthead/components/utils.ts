/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { resizeObserver } from "@ndla/util";

export const getMastheadHeight = (): number | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }
  const masthead = document.getElementById("masthead");
  return masthead?.getBoundingClientRect().height;
};

export const useMastheadHeight = () => {
  const [height, setHeight] = useState<number>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const masthead = document.getElementById("masthead");

      const handleHeightChange = (el: HTMLElement) => {
        const newHeight = el.getBoundingClientRect().height;
        setHeight(newHeight);
      };

      if (masthead) {
        resizeObserver(masthead, handleHeightChange);
      }
    }
  }, [mounted]);

  return {
    height,
  };
};
