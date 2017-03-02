/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { defaultApiKey, resolveJsonOrRejectWithError, apiResourceUrl } from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/learningpath-api/v1/learningpaths');

export const fetchLearningPaths = ids =>
    fetch(
      `${baseUrl}?ids=${ids.join(',')}`,
      { headers: { 'APP-KEY': defaultApiKey } },
    ).then(resolveJsonOrRejectWithError);
