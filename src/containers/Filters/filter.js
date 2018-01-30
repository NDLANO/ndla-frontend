/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';
import createFetchActions from '../../util/createFetchActions';

export const fetchSubjectFiltersActions = createFetchActions('SUBJECT_FILTERS');
export const fetchFilteredTopics = createAction('FETCH_FILTERED_TOPICS');
export const actions = {
  ...fetchSubjectFiltersActions,
  fetchFilteredTopics,
  setActive: createAction('SET_ACTIVE'),
};

export const initialState = {
  loadingFilters: false,
  all: {},
  active: {},
  hasFailed: false,
};

export default handleActions(
  {
    [actions.fetchSubjectFilters]: {
      next: state => ({
        ...state,
        loadingFilters: true,
      }),
    },
    [actions.fetchSubjectFiltersSuccess]: {
      next: (state, { payload: { id, filters } }) => ({
        ...state,
        loadingFilters: false,
        all: { ...state.all, [id]: filters },
      }),
    },
    [actions.fetchSubjectFiltersError]: {
      next: state => ({
        ...state,
        loadingFilters: false,
        hasFailed: true,
      }),
    },
    [actions.fetchFilteredTopics]: {
      // set hasFetched to true for the clicked filter, before saga fetches
      next: (state, { payload: { subjectId, filterId } }) => ({
        ...state,
        all: {
          ...state.all,
          [subjectId]: state.all[subjectId].map(
            it => (it.id === filterId ? { ...it, hasFetched: true } : it),
          ),
        },
      }),
    },
    [actions.setActive]: {
      next: (state, { payload: { filterId, subjectId } }) => {
        const arr = state.active[subjectId] || [];
        return {
          ...state,
          active: {
            ...state.active,
            [subjectId]: arr.find(it => it === filterId)
              ? arr.filter(it => it !== filterId)
              : [...arr, filterId],
          },
        };
      },
    },
  },
  initialState,
);

const getState = state => state.filters;

export const getActiveFilter = subjectId =>
  createSelector([getState], state => state.active[subjectId]);

export const getFilters = subjectId =>
  createSelector([getState], state => state.all[subjectId] || []);

export const filterHasFetched = ({ subjectId, filterId }) =>
  createSelector(
    getState,
    getFilters(subjectId),
    (state, filters) => filters.find(it => it.id === filterId).hasFetched,
  );
