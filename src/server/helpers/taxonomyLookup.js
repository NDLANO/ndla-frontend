/**
 * Copyright (c) 2018-present, NDLA.
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

const baseUrl = apiResourceUrl('/taxonomy/v1/url/mapping');

export const taxonomyLookup = url => {
  const k = `${baseUrl}?url=${url}`;
  return fetchWithAccessToken(k).then(resolveJsonOrRejectWithError);
};
