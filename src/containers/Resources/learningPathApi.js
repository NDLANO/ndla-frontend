/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  fetchWithAccessToken,
  apiResourceUrl,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/learningpath-api/v1/learningpaths');

export const fetchLearningPaths = ids =>
  fetchWithAccessToken(`${baseUrl}?ids=${ids.join(',')}`).then(
    resolveJsonOrRejectWithError,
  );
