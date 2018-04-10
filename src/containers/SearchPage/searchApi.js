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

const baseUrl = apiResourceUrl('/search-api/search');
const groupUrl = apiResourceUrl('/search-api/groupSearch');

export const search = (queryString, locale) =>
  fetchWithAccessToken(
    `${baseUrl}/?query=${queryString}&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);

export const groupSearch = queryString =>
  fetchWithAccessToken(`${groupUrl}/?query=${queryString}`).then(
    resolveJsonOrRejectWithError,
  );
