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

const taxonomyData = result => {
  let taxonomyResult = {};
  if (result.contexts.length > 0) {
    taxonomyResult = {
      breadcrumb: result.contexts[0].breadcrumbs,
      contentType: getContentType(result.contexts[0]),
      contentTypes: result.contexts.map(context => getContentType(context)),
      subjects:
        result.contexts > 1
          ? result.contexts.map(subject => ({
              url: getUrl(subject, result),
              title: subject.subject,
              contentType: getContentType(subject),
            }))
          : undefined,
      additional: getRelevance(result.contexts[0]),
      type: getResourceType(result.contexts[0]),
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
        ? getUrl(result.contexts[0], result)
        : result.url,
    urls: result.contexts.map(context => ({
      url: getUrl(context, result),
      contentType: getContentType(context),
    })),
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
