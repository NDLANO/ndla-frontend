/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const baseUrl = 'http://localhost:3333/search';
const groupUrl = 'http://localhost:3333/groupSearch';

export const search = (queryString, locale) =>
  fetchWithAccessToken(
    `${baseUrl}/?query=${queryString}&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);

export const groupSearch = queryString =>
  fetchWithAccessToken(`${groupUrl}/?query=${queryString}`).then(
    resolveJsonOrRejectWithError,
  );
