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

export async function runQueries(client, queries, variables) {
  const results = await Promise.all(
    queries.map(async query =>
      client.query({
        errorPolicy: 'all',
        query,
        variables,
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
