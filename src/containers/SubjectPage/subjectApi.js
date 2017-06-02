/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  headerWithAccessToken,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/taxonomy/v1');

export const fetchSubjects = token =>
  fetch(`${baseUrl}/subjects/`, { headers: headerWithAccessToken(token) }).then(
    resolveJsonOrRejectWithError,
  );
