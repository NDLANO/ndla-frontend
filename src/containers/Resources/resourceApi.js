/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RELEVANCE_CORE } from '../../constants';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetch,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/taxonomy/v1');

export const fetchResourceTypesForResource = (resourceId, locale) =>
  fetch(
    `${baseUrl}/resources/${resourceId}/resource-types?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);

export const fetchTopic = (topicId, locale) =>
  fetch(`${baseUrl}/topics/${topicId}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );

export const fetchTopicResources = (
  topicId,
  locale,
  relevance = RELEVANCE_CORE,
) =>
  fetch(
    `${baseUrl}/topics/${topicId}/resources?language=${locale}&relevance=${relevance}`,
  ).then(resolveJsonOrRejectWithError);

export const fetchResourceTypes = (locale) =>
  fetch(`${baseUrl}/resource-types?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );

export const fetchResource = async (resourceId, locale) => {
  const response = await fetch(
    `${baseUrl}/resources/${resourceId}?language=${locale}`,
  );
  return resolveJsonOrRejectWithError(response);
};
