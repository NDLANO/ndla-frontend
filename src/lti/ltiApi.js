/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import 'isomorphic-unfetch';
import {
  resolveJsonOrRejectWithError,
  fetchWithAccessToken,
} from '../util/apiHelpers';

export const postLti = (parameters = { t: '1' }) =>
  fetchWithAccessToken(`lti/embed`, {
    method: 'POST',
    body: { parameters },
  }).then(resolveJsonOrRejectWithError);

export const returnUrl = (url, query = '') => {
  console.log(`${url}${query}`);
  return fetch(`${url}${query}`);
};
