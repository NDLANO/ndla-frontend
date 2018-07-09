/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getToken } from '../helpers/auth';
import {
  storeAccessToken,
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const taxonomyLookup = url => {
  const baseUrl = apiResourceUrl('/taxonomy/v1/url/mapping');
  const k = `${baseUrl}?url=${url}`;
  return fetchWithAccessToken(k).then(resolveJsonOrRejectWithError);
};

export async function forwardingRoute(req, res, next) {
  const token = await getToken();
  storeAccessToken(token.access_token);

  const pathParts = req.originalUrl.substring(1).split('/');
  const languagePrefix =
    pathParts.length > 0 && pathParts[0] !== 'node' ? `/${pathParts[0]}` : '';

  const requestUrl = `ndla.no${req.originalUrl}`;

  try {
    const newPath = await taxonomyLookup(requestUrl);
    res.redirect(301, `${languagePrefix}/subjects${newPath.path}`);
  } catch (e) {
    next();
  }
}
