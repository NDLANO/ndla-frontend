/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from "express";
import { generateOauthData } from "./helpers/oauthHelper";
import { ltiConfig } from "./ltiConfig";
import { contextRedirectRoute } from "./routes/contextRedirectRoute";
import { forwardingRoute } from "./routes/forwardingRoute";
import { oembedArticleRoute } from "./routes/oembedArticleRoute";
import { podcastFeedRoute } from "./routes/podcastFeedRoute";
import { sendResponse } from "./serverHelpers";
import { ABOUT_PATH, FILM_PAGE_URL, UKR_PAGE_URL, programmeRedirects } from "../constants";
import { isValidLocale } from "../i18n";
import { BAD_REQUEST } from "../statusCodes";
import { log } from "../util/logger/logger";
import { stringifiedLanguages } from "./locales/locales";
import authEndpoints from "./authEndpoints";
import { fetchLmk } from "./siktEndpoints";

const router = express.Router();

router.get("/robots.txt", (req, res) => {
  // Using ndla.no robots.txt
  if (req.hostname === "ndla.no") {
    res.setHeader("Cache-Control", "public, max-age=300");
    res.sendFile("robots.txt", { root: "build/public/static" });
  } else {
    res.type("text/plain");
    res.send("User-agent: *\nDisallow: /");
  }
});

router.get("/ai.txt", (_, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.type("text/plain");
  res.send("User-Agent: *\nDisallow: /image");
});

router.get("/.well-known/security.txt", (_, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.sendFile(`security.txt`, { root: "build/public/static" });
});

router.get(["/film", "/:lang/film"], (_, res) => {
  res.redirect(FILM_PAGE_URL);
});

router.get(["/utdanning", "/:lang/utdanning"], (_, res) => {
  res.redirect("/");
});

router.get("/ukr", (_req, res) => {
  res.redirect(`/en${UKR_PAGE_URL}`);
});

router.get("/oembed", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=300");
  const { status, data } = await oembedArticleRoute(req);
  sendResponse(req, res, data, status);
});

router.use(authEndpoints);

router.get(["/about/:path", "/:lang/about/:path"], (req, res) => {
  log.info("Redirecting about path", { path: req.path, params: req.params });
  const { lang, path } = req.params;
  res.redirect(301, lang ? `/${lang}${ABOUT_PATH}/${path}` : `${ABOUT_PATH}/${path}`);
});

router.get<{ path: string[]; lang?: string }>(["/subjects/*path", "/:lang/subjects/*path"], (req, res) => {
  log.info("Redirecting subjects path", { path: req.path, params: req.params });
  const { lang, path = [] } = req.params;
  res.redirect(301, lang ? `/${lang}/${path.join("/")}` : `/${path.join("/")}`);
});

router.get("/lti/config.xml", async (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.removeHeader("X-Frame-Options");
  res.setHeader("Content-Type", "application/xml");
  res.send(ltiConfig());
});

router.get("/utdanningsprogram-sitemap.txt", async (req, res) => {
  sendResponse(req, res, undefined, 410);
});

router.get(["/podkast/:seriesId/feed.xml", `/podkast/:"seriesId"_:seriesTitle/feed.xml`], podcastFeedRoute);

router.post("/lti/oauth", async (req, res) => {
  const { body, query } = req;
  if (!body || !query.url || typeof query.url !== "string") {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  res.setHeader("Cache-Control", "private");
  res.send(JSON.stringify(generateOauthData(query.url, body)));
});

router.get("/locales/:lang/:ns-:hash.json", (req, res) => {
  if (!isValidLocale(req.params.lang) || req.params.ns !== "translation") {
    res.sendStatus(BAD_REQUEST);
    return;
  }
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("Content-Type", "application/json");
  res.send(stringifiedLanguages[req.params.lang].translations);
});

/** Handle different paths to a node in old ndla. */
["node", "printpdf", "easyreader", "contentbrowser/node", "print", "aktualitet", "oppgave", "fagstoff"].forEach(
  (path) => {
    router.get(
      [`/:lang/${path}/:nodeId`, `/:lang/${path}/:nodeId/*splat`, `/${path}/:nodeId`, `/${path}/:nodeId/*splat`],
      async (req, res, next) => forwardingRoute(req, res, next),
    );
  },
);

router.get<{ splat: string[]; lang?: string }>(["/subject*splat", "/:lang/subject*splat"], async (req, res, next) => {
  if (req.params.lang && !isValidLocale(req.params.lang)) {
    next();
  } else {
    contextRedirectRoute(req, res, next);
  }
});

/** Handle semi-old hardcoded programmes. */
router.get(
  ["/utdanning/:name", "/utdanning/:name/vg1", "/utdanning/:name/vg2", "/utdanning/:name/vg3"],
  (req, res, next) => {
    const { name = "" } = req.params;
    if (programmeRedirects[name] !== undefined) {
      log.info("Redirecting programme without contextId", { path: req.path });
      res.redirect(301, `/utdanning/${name}/${programmeRedirects[name]}`);
    } else {
      next();
    }
  },
);

router.get("/lmk/subjects", async (_, res) => {
  res.setHeader("Content-Type", "application/ld+json");
  const response = await fetchLmk();
  res.json(response);
});

router.get("/*splat/search/apachesolr_search*secondsplat", (req, res) => {
  sendResponse(req, res, undefined, 410);
});

export default router;
