/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { RefObject } from "react";

export const scrollToRef = (ref: RefObject<HTMLElement | null>, offset = 100) => {
  const scrollPosition = (ref.current?.offsetTop ?? 0) - offset;
  return window.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });
};
