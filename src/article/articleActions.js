/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';
import * as constants from './articleConstants';

export const fetchArticle = createAction(constants.FETCH_ARTICLE);
export const setArticle = createAction(constants.SET_ARTICLE);
