/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';

export const fetchTopics = createAction('FETCH_TOPICS');
export const setTopics = createAction('SET_TOPICS');
export const fetchTopicArticle = createAction('FETCH_TOPIC_ARTICLE');

export const setTopicIntroductions = createAction('SET_TOPIC_INTRODUCTIONS');
