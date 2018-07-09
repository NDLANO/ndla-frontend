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
  const { nodeId, lang } = req.params;

  const lookupUrl = `ndla.no/node/${nodeId}`;

  try {
    const newPath = await taxonomyLookup(lookupUrl);
    const languagePrefix = lang ? `/${lang}` : '';
    res.redirect(301, `${languagePrefix}/subjects${newPath.path}`);
  } catch (e) {
    next();
  }
}
