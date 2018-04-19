/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import getContentTypeFromResourceTypes from '../../util/getContentTypeFromResourceTypes';

const getContentType = resource =>
  resource.resourceTypes.length > 0
    ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
    : resource.learningResourceType;

const taxonomyData = result => {
  let taxonomyResult = {};

  if (result.contexts.length > 0) {
    taxonomyResult = {
      breadcrumb: result.contexts[0].breadcrumbs,
      subjects: undefined,
      contentType: getContentType(result.contexts[0]),
    };
  }
  if (result.contexts.length > 1) {
    taxonomyResult = {
      ...taxonomyResult,
      subjects: result.contexts.map(subject => ({
        url: `/subjects${subject.path}`,
        title: subject.subject,
        contentType: getContentType(subject),
      })),
    };
  }
  return taxonomyResult;
};

const getSearchFromState = state => state.search;

export const getResults = createSelector([getSearchFromState], search =>
  search.results.map(result => ({
    ...result,
    url:
      result.contexts.length > 0
        ? `/subjects${result.contexts[0].path}`
        : result.url,
    title: convertFieldWithFallback(result, 'title', ''),
    ingress: convertFieldWithFallback(result, 'metaDescription', ''),
    ...taxonomyData(result),
  })),
);

export const getResultsMetadata = createSelector(
  [getSearchFromState],
  search => ({
    pageSize: search.pageSize || 0,
    totalCount: search.totalCount || 0,
    lastPage: Math.ceil(search.totalCount / search.pageSize),
    totalCountLearningPaths: search.totalCountLearningPaths || 0,
    totalCountSubjectMaterial: search.totalCountSubjectMaterial || 0,
    totalCountTasks: search.totalCountTasks || 0,
  }),
);

export const getGroupResults = createSelector([getSearchFromState], search =>
  search.groupResult.map(result => ({
    ...result,
    resources: result.results.map(contentTypeResult => ({
      ...contentTypeResult,
      path:
        contentTypeResult.paths && contentTypeResult.paths.length > 0
          ? `/subjects${contentTypeResult.paths[0]}`
          : contentTypeResult.url,
      name: convertFieldWithFallback(contentTypeResult, 'title', ''),
      resourceType: result.resourceType,
    })),
  })),
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
