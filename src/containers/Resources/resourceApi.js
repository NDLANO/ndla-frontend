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

export const fetchResourceTypesForResource = (resourceId, locale) =>
  fetchWithAccessToken(
    `${baseUrl}/resources/${resourceId}/resource-types/?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);

export const fetchTopicResources = (
  topicId,
  locale,
  relevance = 'urn:relevance:core',
) =>
  fetchWithAccessToken(
    `${baseUrl}/topics/${topicId}/resources/?language=${locale}&relevance=${relevance}`,
  ).then(resolveJsonOrRejectWithError);

export const fetchResourceTypes = locale =>
  fetchWithAccessToken(`${baseUrl}/resource-types/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );

export const fetchResource = async (resourceId, locale) => {
  const response = await fetchWithAccessToken(
    `${baseUrl}/resources/${resourceId}/?language=${locale}`,
  );
  return resolveJsonOrRejectWithError(response);
};
