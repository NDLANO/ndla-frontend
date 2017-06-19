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

const baseUrl = apiResourceUrl('/taxonomy/v1');

export const fetchTopics = (subjectId, locale) =>
  fetchWithAccessToken(
    `${baseUrl}/subjects/${subjectId}/topics/?recursive=true&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
