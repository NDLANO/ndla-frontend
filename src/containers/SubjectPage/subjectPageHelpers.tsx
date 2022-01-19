/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { RefObject } from 'react';
import queryString from 'query-string';
import { toTopicPartial } from '../../routeHelpers';
import { GQLResourceTypeDefinition } from '../../graphqlTypes';

export const toTopic = (subjectId: string) => toTopicPartial(subjectId);

export const getSearchUrl = (
  subjectId: string,
  resourceType: GQLResourceTypeDefinition,
) => {
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

export const scrollToRef = (
  ref: RefObject<HTMLElement | null>,
  offset = 100,
) => {
  const scrollPosition = (ref.current?.offsetTop ?? 0) - offset;
  return window.scrollTo({
    top: scrollPosition,
    behavior: 'smooth',
  });
};
