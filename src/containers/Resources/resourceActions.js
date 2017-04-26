/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';

export const setTopicResources = createAction('SET_TOPIC_RESOURCES');
export const setArticleResourceData = createAction('SET_ARTICLE_RESOURCE_DATA');
export const setLearningPathResourceData = createAction('SET_LEARNING_PATH_RESOURCE_DATA');
export const fetchTopicResources = createAction('FETCH_TOPIC_RESOURCES');
export const setResourceTypes = createAction('SET_RESOURCE_TYPES');
