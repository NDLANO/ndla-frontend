/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { NextFunction, Request, Response } from "express";
import { NOT_FOUND_PAGE_PATH } from "../../constants";
import { BAD_REQUEST } from "../../statusCodes";
import podcastRssFeed from "../podcastRssFeed";

export const podcastFeedRoute = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.seriesId ?? "");
  if (isNaN(id)) {
    res.status(BAD_REQUEST);
    res.send("Invalid ID for series supplied. ID must be an integer.");
    return;
  }

  await podcastRssFeed(id)
    .then((podcastPage) => {
      res.setHeader("Content-Type", "application/xml");
      res.send(podcastPage);
    })
    .catch((err) => {
      if (err.status === 404) {
        res.redirect(NOT_FOUND_PAGE_PATH);
        return;
      }

      next(err);
    });
};
