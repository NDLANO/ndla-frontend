/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as constants from './articleConstants';

const initalState = {};


const reduceArrayById = array => array.reduce((obj, item) => Object.assign({}, obj, { [item.id]: item }), {});

export default handleActions({
  [constants.SET_CONVERTED_ARTICLE]: {
    next: (state, action) => ({ ...state, [action.payload.id]: { ...action.payload, converted: true } }),
    throw: state => state,
  },
  [constants.SET_ARTICLES]: {
    next: (state, action) => ({ ...state, ...reduceArrayById(action.payload) }),
    throw: state => state,
  },
}, initalState);
