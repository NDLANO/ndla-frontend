/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';
import * as constants from './resourceConstants';

export const setTopicResources = createAction(constants.SET_TOPIC_RESOURCES);
export const setArticleResourceData = createAction(constants.SET_ARTICLE_RESOURCE_DATA);
export const setLearningPathResourceData = createAction(constants.SET_LEARNING_PATH_RESOURCE_DATA);
export const fetchTopicResources = createAction('FETCH_TOPIC_RESOURCES');
