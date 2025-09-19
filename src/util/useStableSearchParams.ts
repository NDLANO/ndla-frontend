/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useSearchParams } from "react-router";

// The purpose of this hook is to provide a stable search params object that is always sorted by key. `useSearchParams` from "react-router" does not guarantee the order of the search params.
export const useStableSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setSortedSearchParams = useCallback(
    (newParams: Record<string, string | null | undefined>, options: { replace?: boolean } = {}) => {
      const mergedParams = new URLSearchParams(searchParams); // Start with existing params

      // Merge new params
      Object.entries(newParams).forEach(([key, value]) => {
        if (!value) {
          mergedParams.delete(key);
        } else {
          mergedParams.set(key, value);
        }
      });

      // Sort parameters by key
      const sortedParams = new URLSearchParams();
      Array.from(mergedParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([key, value]) => sortedParams.append(key, value));

      // Prevent unnecessary updates
      if (sortedParams.toString() !== searchParams.toString()) {
        setSearchParams(sortedParams, { replace: options.replace ?? true }); // Default replace=true to prevent history clutter
      }
    },
    [searchParams, setSearchParams],
  );

  return [searchParams, setSortedSearchParams] as const;
};
