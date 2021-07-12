/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { DocumentNode, useQuery } from '@apollo/client';

export const useGraphQuery = <T>(query: DocumentNode, options = {}) => {
  const { error, data, loading } = useQuery<T>(query, {
    errorPolicy: 'all',
    ...options,
  });

  return { error, data, loading };
};
