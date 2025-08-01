/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Request, Response } from "express";
import { OK, MOVED_PERMANENTLY, TEMPORARY_REDIRECT, GONE } from "../statusCodes";
import { LocaleType } from "../interfaces";
import { ManifestChunk } from "vite";
import { NDLAError } from "../util/error/NDLAError";
import handleError from "../util/handleError";

interface RenderLocationReturn {
  status: number;
  location: string;
}

export interface RenderDataReturn {
  status: number;
  locale: LocaleType;
  data: {
    htmlContent: string;
    data?: any;
  };
}

export type RenderReturn = RenderLocationReturn | RenderDataReturn;

export type RenderFunc = (req: Request, chunks?: ManifestChunk[]) => Promise<RenderReturn>;

export type RootRenderFunc = (
  req: Request,
  res: Response,
  renderer: string,
  chunks: ManifestChunk[],
) => Promise<RenderReturn>;

export const sendResponse = (req: Request, res: Response, data: any, status = OK) => {
  if (status >= 500) {
    handleError(new NDLAError(`Returning code ${status} for ${req.url}`), req.url, { statusCode: status });
  }

  if (status === MOVED_PERMANENTLY || status === TEMPORARY_REDIRECT) {
    res.writeHead(status, data);
    res.end();
  } else if (status === GONE) {
    res.status(status).send(data);
  } else if (res.getHeader("Content-Type") === "application/json") {
    res.status(status).json(data);
  } else {
    res.status(status).send(data);
  }
};
