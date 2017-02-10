/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';
import * as constants from './articleConstants';

export const fetchConvertedArticle = createAction(constants.FETCH_CONVERTED_ARTICLE);
export const setConvertedArticle = createAction(constants.SET_CONVERTED_ARTICLE);
export const setArticles = createAction(constants.SET_ARTICLE);
