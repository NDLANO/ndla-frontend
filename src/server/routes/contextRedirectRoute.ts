/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NextFunction, Request, Response } from "express";
import { Query } from "express-serve-static-core";
import { ResolvedUrl } from "@ndla/types-taxonomy";
import { resolveJsonOrRejectWithError, apiResourceUrl } from "../../util/apiHelpers";

async function resolve(path: string, lang?: string) {
  const baseUrl = apiResourceUrl("/taxonomy/v1/url/resolve");
  const langPart = lang ? `&language=${lang}` : "";
  const response = await fetch(`${baseUrl}?path=${path}${langPart}`);
  return resolveJsonOrRejectWithError<ResolvedUrl>(response);
}

export const redirectPath = async (path: string, lang?: string) => {
  const resource = await resolve(path);
  const languagePrefix = lang && lang !== "nb" ? lang : ""; // send urls with nb to root/default lang
  return `${languagePrefix ? `/${languagePrefix}` : ""}${resource!.url}`;
};

type SplatRequest = Request<{ splat: string[]; lang?: string }, any, any, Query, Record<string, any>>;

export async function contextRedirectRoute(req: SplatRequest, res: Response, next: NextFunction) {
  try {
    const path = await redirectPath(`/subject${req.params.splat?.join("/").replaceAll(",", "/")}`, req.params.lang);
    res.redirect(301, path);
  } catch (e) {
    next();
  }
}
