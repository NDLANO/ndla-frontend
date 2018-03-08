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
import config from '../../config';

export const fetchSubjectsActions = createFetchActions('SUBJECTS');
export const setSubjects = createAction('SET_SUBJECTS');

export const actions = {
  ...fetchSubjectsActions,
  setSubjects,
};

export const initialState = {
  hasFetched: false,
  fetching: false,
  all: [],
  hasFetchSubjectsFailed: false,
};

export default handleActions(
  {
    [actions.fetchSubjects]: {
      next: state => ({
        ...state,
        fetching: true,
        hasFetchSubjectsFailed: false,
      }),
      throw: state => state,
    },
    [actions.setSubjects]: {
      next: (state, action) => ({
        ...state,
        all: action.payload,
        fetching: false,
        hasFetched: true,
        hasFetchSubjectsFailed: false,
      }),
      throw: state => state,
    },
    [actions.fetchSubjectsError]: {
      next: state => ({
        ...state,
        fetching: false,
        hasFetchSubjectsFailed: true,
      }),
      throw: state => state,
    },
  },
  initialState,
);

const getSubjectsFromState = state => state.subjects;

export const getSubjects = createSelector([getSubjectsFromState], subjects =>
  // Quick fix for removing MK subject in prod
  subjects.all.filter(subject => {
    if (config.isNdlaProdEnvironment) {
      return subject.id !== 'urn:subject:1';
    }
    return true;
  }),
);

export const hasFetchSubjectsFailed = createSelector(
  [getSubjectsFromState],
  subjects => subjects.hasFetchSubjectsFailed,
);

export const getTopicIntroductions = createSelector(
  [getSubjectsFromState],
  subjects => subjects.topicIntroductions,
);

export const getSubjectById = id =>
  createSelector([getSubjects], subjects => subjects.find(s => s.id === id));

export const hasFetched = createSelector(
  [getSubjectsFromState],
  subjects => subjects.hasFetched,
);
