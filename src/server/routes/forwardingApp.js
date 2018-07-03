/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyLookup } from '../helpers/taxonomyLookup';
import { getToken } from '../helpers/auth';
import { storeAccessToken } from '../../util/apiHelpers';

export async function forwardingApp(req, resp, next) {
  const token = await getToken();
  storeAccessToken(token.access_token);

  const requestUrl = req.hostname + req.originalUrl;
  await taxonomyLookup(requestUrl)
    .then(newPath => resp.redirect(301, `/subjects${newPath.path}`))
    .catch(() => next());
}
