/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mergeError = (obj, result) => {
  if (!result.errors) {
    return [...obj.errors];
  }
  return [...obj.errors, ...result.errors];
};

export async function runQueries(client, queries) {
  const fetchPolicy =
    process.env.BUILD_TARGET === 'client' && window.e2e === true
      ? 'no-cache'
      : 'cache-first';
  const results = await Promise.all(
    queries.map(async options =>
      client.query({
        fetchPolicy,
        errorPolicy: 'all',
        ...options,
      }),
    ),
  );

  const mergedResults = results.reduce(
    (obj, result) => ({
      ...obj,
      ...result,
      errors: mergeError(obj, result),
      data: { ...obj.data, ...result.data },
    }),
    { errors: [] },
  );

  if (mergedResults.errors.length === 0) {
    delete mergedResults.errors;
  }

  return mergedResults;
}
