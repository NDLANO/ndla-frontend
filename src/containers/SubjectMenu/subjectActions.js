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
