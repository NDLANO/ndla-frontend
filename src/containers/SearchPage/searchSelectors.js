/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import { constants } from 'ndla-ui';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import getContentTypeFromResourceTypes from '../../util/getContentTypeFromResourceTypes';
import config from '../../config';

const getContentType = resource => {
  if (resource.resourceTypes.length > 0) {
    return getContentTypeFromResourceTypes(resource.resourceTypes).contentType;
  }
  if (resource.learningResourceType === 'topic-article') {
    return constants.contentTypes.SUBJECT;
  }
  return constants.contentTypes.SUBJECT_MATERIAL;
};

const getRelevance = resource => {
  if (resource.filters.length > 0) {
    return (
      // Consider getting from constants
      resource.filters[0].relevance === 'Tilleggsstoff' ||
      resource.filters[0].relevance === 'Supplementary'
    );
  }
  return false;
};

const getResourceType = resource => {
  if (resource.resourceTypes.length > 0) {
    if (resource.resourceTypes.length > 1) {
      return resource.resourceTypes[1].name;
    }
    // Avoid showing name for single types
    if (
      resource.resourceTypes[0].id !== 'urn:resourcetype:learningPath' &&
      resource.resourceTypes[0].id !== 'urn:resourcetype:subjectMaterial'
    )
      return resource.resourceTypes[0].name;
  }
  return null;
};

const getUrl = (subject, result) => {
  if (subject.learningResourceType === 'learningpath') {
    return {
      href: `${config.learningPathDomain}/learningpaths/${
        result.id
      }/first-step`,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return `/subjects${subject.path}`;
};

const selectContext = (contexts, filters) => {
  if (contexts.length === 0) return undefined;
  if (filters.length > 0) {
    const foundContext = contexts.filter(context =>
      context.path.includes(filters[0].replace('urn:', '')),
    );
    if (foundContext.length > 0) return foundContext[0];
  }
  return contexts[0];
};

const taxonomyData = (result, selectedContext) => {
  let taxonomyResult = {};
  if (selectedContext) {
    taxonomyResult = {
      breadcrumb: selectedContext.breadcrumbs,
      contentType: getContentType(selectedContext),
      contentTypes: result.contexts.map(context => getContentType(context)),
      subjects:
        result.contexts > 1
          ? result.contexts.map(subject => ({
              url: getUrl(subject, result),
              title: subject.subject,
              contentType: getContentType(subject),
            }))
          : undefined,
      additional: getRelevance(selectedContext),
      type: getResourceType(selectedContext),
    };
  }
  return taxonomyResult;
};

const getSearchFromState = state => state.search;

export const getResults = subjectFilters =>
  createSelector([getSearchFromState], search =>
    search.results.map(result => {
      const selectedContext = selectContext(result.contexts, subjectFilters);
      return {
        ...result,
        url: selectedContext ? getUrl(selectedContext, result) : result.url,
        urls: result.contexts.map(context => ({
          url: getUrl(context, result),
          contentType: getContentType(context),
        })),
        title: convertFieldWithFallback(result, 'title', ''),
        ingress: convertFieldWithFallback(result, 'metaDescription', ''),
        ...taxonomyData(result, selectedContext),
      };
    }),
  );

export const getSearching = createSelector(
  [getSearchFromState],
  search => search.searching,
);

export const getFilterState = createSelector(
  [getSearchFromState],
  search => search.filterState,
);

export const getLastPage = createSelector([getSearchFromState], search =>
  Math.ceil(search.totalCount / search.pageSize),
);
