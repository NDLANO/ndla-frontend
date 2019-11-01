import { useQuery } from 'react-apollo';

/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const useGraphQuery = (query, options = {}) => {
  const { error, data, loading } = useQuery(query, {
    errorPolicy: 'all',
    ...options,
  });

  return { error, data, loading };
};
