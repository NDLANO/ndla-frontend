/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { OperationVariables } from "@apollo/client";
import { Cache, InMemoryCache } from "@apollo/client/core";
import handleError from "./handleError";

/**
 * DebugInMemoryCache extends the InMemoryCache and adds a diff method that will log an error if a partial match is found in the cache.
 * This is useful for debugging cache issues where a part of some object is found in the cache, but not the whole object.
 * Can be enabled with `DEBUG_GRAPHQL_CACHE=true` environment variable.
 */
export class DebugInMemoryCache extends InMemoryCache {
  findNestedStrings(obj: any, path: string[], error: Error) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        if (path.length > 0) {
          handleError(new Error(`Missing field in cache: [${[...path, key]}]`, { cause: error }));
        }
      } else {
        this.findNestedStrings(value, [...path, key], error);
      }
    }
  }

  diff<TData, TVariables extends OperationVariables = any>(
    options: Cache.DiffOptions<TData, TVariables>,
  ): Cache.DiffResult<TData> {
    const result = super.diff(options);

    if (result.missing) {
      result.missing.forEach((m) => {
        this.findNestedStrings(m.missing, [], m);
      });
    }

    return result;
  }
}
