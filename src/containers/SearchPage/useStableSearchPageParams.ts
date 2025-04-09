/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useStableSearchParams } from "../../util/useStableSearchParams";

// This is just a thin wrapper around `useStableSearchParams` that unsets the `page` parameter (if it exists) when any other params are changed.
export const useStableSearchPageParams = () => {
  const [searchParams, _setSearchParams] = useStableSearchParams();

  const setSortedSearchParams = useCallback(
    (newParams: Record<string, string | null | undefined>, options: { replace?: boolean } = {}) => {
      if (searchParams.get("page") && !newParams.page) {
        return _setSearchParams({ ...newParams, page: null }, options);
      }
      return _setSearchParams(newParams, options);
    },
    [searchParams, _setSearchParams],
  );

  return [searchParams, setSortedSearchParams] as const;
};
