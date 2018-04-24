/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl, // eslint-disable-line
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/search-api/v1/search/');

export const search = (searchString, locale) => {
  if (searchString) {
    return fetchWithAccessToken(
      `${baseUrl}${searchString}&language=${locale}`,
    ).then(resolveJsonOrRejectWithError);
  }
  return fetchWithAccessToken(`${baseUrl}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
};

export const groupSearch = (searchString, locale) =>
  fetchWithAccessToken(
    `${baseUrl}group/${searchString}&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
