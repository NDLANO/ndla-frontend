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

export const actions = {
  ...fetchSubjectFiltersActions,
  setActive: createAction('SET_ACTIVE'),
};

export const initialState = {
  loadingFilters: false,
  all: {},
  active: '',
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
    [actions.setActive]: {
      next: (state, { payload: { filterId, subjectId } }) => ({
        ...state,
        active: {
          ...state.active,
          [subjectId]: state.active[subjectId] === filterId ? '' : filterId,
        },
      }),
    },
  },
  initialState,
);

export const getActiveFilter = subjectId =>
  createSelector([state => state.filters], state => state.active[subjectId]);
