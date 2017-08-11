/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';

export const FETCH_ARTICLE = 'FETCH_ARTICLE';
export const SET_ARTICLE = 'SET_ARTICLE';
export const fetchArticle = createAction(FETCH_ARTICLE);
export const setArticle = createAction(SET_ARTICLE);
