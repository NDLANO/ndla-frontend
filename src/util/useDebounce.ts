/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useRef } from "react";

export const useDebounce = <T>(value: T, wait: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (lastValueRef.current === value) return; // skip if value hasn't changed

    lastValueRef.current = value;
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, wait);

    return () => clearTimeout(timer);
  }, [value, wait]);

  return debouncedValue;
};
