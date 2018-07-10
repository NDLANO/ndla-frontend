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

async function findNBNodeId(nodeId, lang) {
  // We only need to lookup nodeId if lang is nn. Taxonomy should handle other langs
  if (lang !== 'nn') {
    return nodeId;
  }

  const baseUrl = apiResourceUrl('/article-api/v2/articles');
  const response = await fetchWithAccessToken(
    `${baseUrl}/external_ids/${nodeId}`,
  );
  const data = await resolveJsonOrRejectWithError(response);

  // The nodeId for language nb is the first item in externalIds array.
  return data.externalIds[0];
}

async function taxonomyLookup(url) {
  const baseUrl = apiResourceUrl('/taxonomy/v1/url/mapping');
  const response = await fetchWithAccessToken(`${baseUrl}?url=${url}`);
  return resolveJsonOrRejectWithError(response);
}

export async function forwardingRoute(req, res, next) {
  const token = await getToken();
  storeAccessToken(token.access_token);
  const { lang } = req.params;

  try {
    const nodeId = await findNBNodeId(req.params.nodeId, lang); // taxonomy lookup does'nt handle nn

    const lookupUrl = `ndla.no/node/${nodeId}`;
    const newPath = await taxonomyLookup(lookupUrl);

    const languagePrefix = lang && lang !== 'nb' ? `/${lang}` : ''; // send urls with nb to root/default lang
    res.redirect(301, `${languagePrefix}/subjects${newPath.path}`);
  } catch (e) {
    next();
  }
}
