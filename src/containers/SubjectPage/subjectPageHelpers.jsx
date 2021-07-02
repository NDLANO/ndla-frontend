/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { toTopicPartial } from '../../routeHelpers';

export const toTopic = subjectId => toTopicPartial(subjectId);

export const getSearchUrl = (subjectId, resourceType) => {
  const baseUrl = '/search';
  const searchParams = {
    'resource-types': 'urn:resourcetype:subjectMaterial',
    contextFilters:
      resourceType.id !== 'urn:resourcetype:subjectMaterial'
        ? resourceType.id
        : undefined,
    page: 1,
    subjects: `urn:${subjectId}`,
  };
  return `${baseUrl}?${queryString.stringify(searchParams)}`;
};

export const scrollToRef = (ref, offset = 100) =>
  window.scrollTo({
    top: ref.current.offsetTop - offset,
    behavior: 'smooth',
  });
