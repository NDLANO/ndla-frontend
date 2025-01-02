/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NextFunction, Request, Response } from "express";
import { ResolvedUrl, ResolvedOldUrl } from "@ndla/types-taxonomy";
import { isLearningPathResource, getLearningPathUrlFromResource } from "../../containers/Resources/resourceHelpers";
import { resolveJsonOrRejectWithError, apiResourceUrl } from "../../util/apiHelpers";
import log from "../../util/logger";

interface ExternalIds {
  externalIds: string[];
}

async function findNBNodeId(nodeId: string, lang?: string) {
  // We only need to lookup nodeId if lang is nn. Taxonomy should handle other langs
  if (lang !== "nn") {
    return nodeId;
  }

  const baseUrl = apiResourceUrl("/article-api/v2/articles");
  const response = await fetch(`${baseUrl}/external_ids/${nodeId}`);

  // The nodeId my be a learningpath (return nodeId)
  if (response.status === 404) {
    return nodeId;
  }

  const data = await resolveJsonOrRejectWithError<ExternalIds>(response);

  // The nodeId for language nb is the first item in externalIds array.
  // @ts-expect-error - This is fulfilled automatically
  return data.externalIds[0];
}

async function lookup(url: string) {
  const baseUrl = apiResourceUrl("/taxonomy/v1/url/mapping");
  const response = await fetch(`${baseUrl}?url=${url}`);
  return resolveJsonOrRejectWithError<ResolvedOldUrl>(response);
}

async function resolve(path: string) {
  const baseUrl = apiResourceUrl("/taxonomy/v1/url/resolve");
  const response = await fetch(`${baseUrl}?path=${path}`);
  return resolveJsonOrRejectWithError<ResolvedUrl>(response);
}

export const forwardPath = async (forwardNodeId: string, lang?: string) => {
  const nodeId = await findNBNodeId(forwardNodeId, lang); // taxonomy lookup doesn't handle nn

  const lookupUrl = `ndla.no/node/${nodeId}`;
  const data = await lookup(lookupUrl);

  const resource = await resolve(data!.path);

  const languagePrefix = lang && lang !== "nb" ? lang : ""; // send urls with nb to root/default lang

  if (isLearningPathResource(resource!)) {
    return getLearningPathUrlFromResource(resource!, languagePrefix);
  } else {
    return `${languagePrefix ? `/${languagePrefix}` : ""}${resource!.url}`;
  }
};

export async function forwardingRoute(req: Request, res: Response, next: NextFunction) {
  try {
    log.info("Redirecting old ndla path", { path: req.path });
    const path = await forwardPath(req.params.nodeId!, req.params.lang);
    res.redirect(301, path);
  } catch (e) {
    next();
  }
}
