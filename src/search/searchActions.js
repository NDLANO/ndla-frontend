/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';
import * as constants from './searchConstants';

export const search = createAction(constants.SEARCH);
export const setSearchResult = createAction(constants.SET_SEARCH_RESULT);
