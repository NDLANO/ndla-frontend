/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';
import * as constants from './subjectConstants';

export const fetchSubjects = createAction(constants.FETCH_SUBJECTS);
export const setSubjects = createAction(constants.SET_SUBJECTS);

export const fetchTopics = createAction(constants.FETCH_TOPICS);
export const setTopics = createAction(constants.SET_TOPICS);
export const fetchTopicsAndArticle = createAction(constants.FETCH_TOPICS_AND_ARTICLE);
