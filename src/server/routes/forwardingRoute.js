/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetch,
} from '../../util/apiHelpers';
import {
  isLearningPathResource,
  getLearningPathUrlFromResource,
} from '../../containers/Resources/resourceHelpers';

async function findNBNodeId(nodeId, lang) {
  // We only need to lookup nodeId if lang is nn. Taxonomy should handle other langs
  if (lang !== 'nn') {
    return nodeId;
  }

  const baseUrl = apiResourceUrl('/article-api/v2/articles');
  const response = await fetch(`${baseUrl}/external_ids/${nodeId}`);

  // The nodeId my be a learningpath (return nodeId)
  if (response.status === 404) {
    return nodeId;
  }

  const data = await resolveJsonOrRejectWithError(response);

  // The nodeId for language nb is the first item in externalIds array.
  return data.externalIds[0];
}

async function lookup(url) {
  const baseUrl = apiResourceUrl('/taxonomy/v1/url/mapping');
  const response = await fetch(`${baseUrl}?url=${url}`);
  return resolveJsonOrRejectWithError(response);
}

async function resolve(path) {
  const baseUrl = apiResourceUrl('/taxonomy/v1/url/resolve');
  const response = await fetch(`${baseUrl}?path=${path}`);
  return resolveJsonOrRejectWithError(response);
}

export async function forwardingRoute(req, res, next) {
  const { lang } = req.params;

  try {
    const nodeId = await findNBNodeId(req.params.nodeId, lang); // taxonomy lookup doesn't handle nn

    const lookupUrl = `ndla.no/node/${nodeId}`;
    const data = await lookup(lookupUrl);

    const resource = await resolve(data.path);

    const languagePrefix = lang && lang !== 'nb' ? lang : ''; // send urls with nb to root/default lang
    if (isLearningPathResource(resource)) {
      res.redirect(
        301,
        getLearningPathUrlFromResource(resource, languagePrefix),
      );
    } else {
      res.redirect(
        301,
        `${languagePrefix ? `/${languagePrefix}` : ''}${data.path}`,
      );
    }
  } catch (e) {
    next();
  }
}
