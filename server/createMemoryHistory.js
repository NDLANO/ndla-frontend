/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import useQueries from 'history/lib/useQueries';
import useBasename from 'history/lib/useBasename';
import baseCreateMemoryHistory from 'history/lib/createMemoryHistory';

export default function createMemoryHistory(fullPath, options) {
  const baseMemoryHistory = baseCreateMemoryHistory(fullPath);
  const createHistory = () => baseMemoryHistory;
  const history = useQueries(useBasename(createHistory))(options);
  return history;
}
