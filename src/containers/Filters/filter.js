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
export const fetchFiltersActions = createFetchActions('FILTERS');
export const fetchFilteredTopics = createAction('FETCH_FILTERED_TOPICS');
export const actions = {
  ...fetchSubjectFiltersActions,
  ...fetchFiltersActions,
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
    [actions.fetchFilters]: {
      next: state => ({
        ...state,
        loadingFilters: true,
      }),
    },
    [actions.fetchFiltersSuccess]: {
      next: (state, { payload: { filters } }) => ({
        ...state,
        loadingFilters: false,
        all: { ...state.all, filters },
      }),
    },
    [actions.fetchFiltersError]: {
      next: state => ({
        ...state,
        loadingFilters: false,
        hasFailed: true,
      }),
    },
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
      next: (state, { payload: { newValues, subjectId } }) => ({
        ...state,
        active: {
          ...state.active,
          [subjectId]: newValues,
        },
      }),
    },
  },
  initialState,
);

const getState = state => state.filters;

export const getActiveFilter = subjectId =>
  createSelector([getState], state => state.active[subjectId]);

const getFilterFromField = (filters, field) =>
  filters.all[field]
    ? filters.all[field].map(filt => ({
        ...filt,
        title: filt.name,
        value: filt.id,
      }))
    : [];

export const getFilters = subjectId =>
  createSelector([getState], state => getFilterFromField(state, subjectId));

export const getMultipeSubjectFilters = subjects =>
  createSelector([getState], state =>
    getFilterFromField(state, 'filters').filter(
      filter => subjects.indexOf(filter.subjectId) !== -1,
    ),
  );

export const filterHasFetched = ({ subjectId, filterId }) =>
  createSelector(
    getState,
    getFilters(subjectId),
    (state, filters) => filters.find(it => it.id === filterId).hasFetched,
  );
