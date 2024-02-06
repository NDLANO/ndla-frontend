/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Request, Response } from "express";
import { NOT_FOUND_PAGE_PATH } from "../../constants";
import { BAD_REQUEST } from "../../statusCodes";
import podcastRssFeed from "../podcastRssFeed";
import { sendInternalServerError } from "../server";

export const podcastFeedRoute = async (req: Request, res: Response) => {
  const id = req.params.seriesId;

  if (!id) {
    res.status(BAD_REQUEST);
    res.send("Invalid ID for series supplied. ID must be an integer.");
    return;
  }
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    res.status(BAD_REQUEST);
    res.send("Invalid ID for series supplied. ID must be an integer.");
    return;
  }

  await podcastRssFeed(idNum)
    .then((podcastPage) => {
      res.setHeader("Content-Type", "application/xml");
      res.send(podcastPage);
    })
    .catch((err) => {
      if (err.status === 404) {
        res.redirect(NOT_FOUND_PAGE_PATH);
        return;
      }

      sendInternalServerError(res);
    });
};
