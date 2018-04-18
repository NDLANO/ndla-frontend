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

const contentType = result => {
  const type = result.contexts[0].learningResourceType;
  switch (type) {
    case 'learningpath':
      return 'learning-path';
    case 'article':
      return 'article';
    default:
      return type;
  }
};

const taxonomyData = result => {
  let taxonomyResult = {};

  if (result.contexts.length > 0) {
    taxonomyResult = {
      breadcrumb: result.contexts[0].breadcrumbs,
      subjects: undefined,
      contentType: result.resourceTypes
        ? getContentTypeFromResourceTypes(result.resourceTypes)
        : contentType(result),
    };
  }
  if (result.contexts.length > 1) {
    taxonomyResult = {
      ...taxonomyResult,
      subjects: result.contexts.map(subject => ({
        url: subject.path,
        title: subject.subject,
        contentType: subject.learningResourceType,
      })),
    };
  }
  return taxonomyResult;
};

const getSearchFromState = state => state.search;

export const getResults = createSelector([getSearchFromState], search =>
  search.results.map(result => ({
    ...result,
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

export const getGroupResults = createSelector(
  [getSearchFromState],
  search => search.groupResult.map(result => ({
      ...result,
      resources: result.results.map((contentTypeResult) => ({
        ...contentTypeResult,
        path: contentTypeResult.url,
        name: convertFieldWithFallback(contentTypeResult, 'title', ''),
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
