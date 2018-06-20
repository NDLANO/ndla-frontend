/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';

export const getFiltersFromUrl = location => {
  const urlParams = queryString.parse(location.search || '');
  return urlParams.filters || '';
};

export const getFiltersFromUrlAsArray = location => {
  const filters = getFiltersFromUrl(location);
  return filters.length > 0 ? filters.split(',') : [];
};
