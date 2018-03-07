/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';

const getSearchFromState = state => state.search;

export const getResults = createSelector([getSearchFromState], search =>
  search.results.map(
    it =>
      Array.isArray(it.subjects)
        ? {
            ...it,
            ...(it.subjects.length === 1
              ? { breadcrumb: it.subjects[0].breadcrumbs, subjects: undefined }
              : {
                  subjects: it.subjects.map(sub => ({
                    url: sub.path,
                    title: sub.name,
                  })),
                }),
          }
        : it,
  ),
);

export const getGroupResults = createSelector(
  [getSearchFromState],
  search => search.groupResult,
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
