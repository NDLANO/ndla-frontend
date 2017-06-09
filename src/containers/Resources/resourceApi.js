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
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/taxonomy/v1');

export const fetchTopicResources = (topicId) =>
  fetchWithAccessToken(`${baseUrl}/topics/${topicId}/resources/?recursive=true`).then(resolveJsonOrRejectWithError);
export const fetchResourceTypes = () =>
  fetchWithAccessToken(`${baseUrl}/resource-types/`).then(resolveJsonOrRejectWithError);
