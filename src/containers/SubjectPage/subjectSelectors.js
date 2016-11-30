/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';

const getSubjectsFromState = state => state.subjects;

export const getSubjects = createSelector(
    [getSubjectsFromState],
    subjects => subjects.all
);

export const hasFetched = createSelector(
    [getSubjectsFromState],
    subjects => subjects.hasFetched
);

export const getTopicsBySubjectId = subjectId => createSelector(
  [getSubjectsFromState],
  subjects => subjects.topics[subjectId]
);
