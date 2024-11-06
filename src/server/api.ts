/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from "express";
import jwt from "jsonwebtoken";
import { errors } from "openid-client";
import { matchPath } from "react-router-dom";
import { getCookie } from "@ndla/util";
import OPError = errors.OPError;
import { generateOauthData } from "./helpers/oauthHelper";
import { feideLogout, getFeideToken, getRedirectUrl } from "./helpers/openidHelper";
import ltiConfig from "./ltiConfig";
import { forwardingRoute } from "./routes/forwardingRoute";
import { oembedArticleRoute } from "./routes/oembedArticleRoute";
import { podcastFeedRoute } from "./routes/podcastFeedRoute";
import { sendResponse } from "./serverHelpers";
import config, { getEnvironmentVariabel } from "../config";
import { FILM_PAGE_PATH, STORED_LANGUAGE_COOKIE_KEY, UKR_PAGE_PATH } from "../constants";
import { getLocaleInfoFromPath } from "../i18n";
import { routes } from "../routeHelpers";
import { privateRoutes } from "../routes";
import { OK, BAD_REQUEST } from "../statusCodes";
import { isAccessTokenValid } from "../util/authHelpers";
import { BadRequestError } from "../util/error/StatusError";
import { log } from "../util/handleError";
import { constructNewPath } from "../util/urlHelper";

const router = express.Router();

router.get("/robots.txt", (req, res) => {
  // Using ndla.no robots.txt
  if (req.hostname === "ndla.no") {
    res.sendFile("robots.txt", { root: "build/public/static" });
  } else {
    res.type("text/plain");
    res.send("User-agent: *\nDisallow: /");
  }
});

router.get("/.well-known/security.txt", (_, res) => {
  res.sendFile(`security.txt`, { root: "build/public/static" });
});

router.get("/health", (_, res) => {
  res.status(OK).json({ status: OK, text: "Health check ok" });
});

router.get("/film", (_, res) => {
  res.redirect(FILM_PAGE_PATH);
});

router.get("/utdanning", (_, res) => {
  res.redirect("/");
});

router.get("/ukr", (_req, res) => {
  res.cookie(STORED_LANGUAGE_COOKIE_KEY, "en");
  res.redirect(`/en${UKR_PAGE_PATH}`);
});

router.get("/oembed", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { status, data } = await oembedArticleRoute(req);
  sendResponse(res, data, status);
});

const getLang = (paramLang?: string, cookieLang?: string | null): string | undefined => {
  if (paramLang) {
    return paramLang;
  }
  if (!paramLang && cookieLang && cookieLang !== config.defaultLocale) {
    return cookieLang;
  }
  return undefined;
};

router.get(["/:lang/login", "/login"], async (req, res) => {
  const feideCookie = getCookie("feide_auth", req.headers.cookie ?? "") ?? "";
  const feideToken = feideCookie ? JSON.parse(feideCookie) : undefined;
  const state = typeof req.query.state === "string" ? req.query.state : "";
  res.setHeader("Cache-Control", "private");
  const lang = getLang(req.params.lang, getCookie(STORED_LANGUAGE_COOKIE_KEY, req.headers.cookie ?? ""));
  const redirect = constructNewPath(state, lang);

  if (feideToken && isAccessTokenValid(feideToken)) {
    return res.redirect(state);
  }
  const { verifier, url } = await getRedirectUrl(req, redirect);
  res.cookie("PKCE_code", verifier, { httpOnly: true });
  return res.redirect(url);
});

router.get("/login/success", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : undefined;
  const state = typeof req.query.state === "string" ? req.query.state : "/";
  res.setHeader("Cache-Control", "private");
  const verifier = getCookie("PKCE_code", req.headers.cookie ?? "");
  if (!code || !verifier) {
    throw new BadRequestError("Missing code or verifier");
  }

  const token = await getFeideToken(req, verifier, code).catch((error: Error) => {
    if (error instanceof OPError) {
      log?.info("Got OPError when fetching feide token.", { error });
      throw new BadRequestError(`Got OPError when fetching feide token: ${error.message}`);
    }
    return Promise.reject(error);
  });

  const feideCookie = {
    ...token,
    ndla_expires_at: (token.expires_at ?? 0) * 1000,
  };
  const domain = req.hostname === config.feideDomain ? `.${config.feideDomain}` : req.hostname;
  res.cookie("feide_auth", JSON.stringify(feideCookie), {
    expires: new Date(feideCookie.ndla_expires_at),
    encode: String,
    domain,
  });

  // Set cookie for nodebb to use
  const username = "https://n.feide.no/claims/eduPersonPrincipalName";
  const decoded = token.id_token ? jwt.decode(token.id_token, {}) : undefined;
  const nodebbCookie = {
    id: decoded?.sub,
    username: decoded?.[username],
    fullname: decoded?.name,
  };
  const nodebbCookieString = jwt.sign(nodebbCookie, getEnvironmentVariabel("NODEBB_SECRET", "secret"));
  res.cookie("nodebb_auth", nodebbCookieString, { domain });

  const languageCookie = getCookie(STORED_LANGUAGE_COOKIE_KEY, req.headers.cookie ?? "");
  //workaround to ensure language cookie is set before redirecting to state path
  if (!languageCookie) {
    const { basename } = getLocaleInfoFromPath(state);
    res.cookie(STORED_LANGUAGE_COOKIE_KEY, basename.length ? basename : config.defaultLocale);
  }
  return res.redirect(state);
});

router.get(["/logout", "/:lang/logout"], async (req, res) => {
  const feideCookie = getCookie("feide_auth", req.headers.cookie ?? "") ?? "";
  const feideToken = feideCookie ? JSON.parse(feideCookie) : undefined;
  const state = typeof req.query.state === "string" ? req.query.state : "/";
  const redirect = constructNewPath(state, req.params.lang);
  res.setHeader("Cache-Control", "private");

  if (!feideToken?.["id_token"] || typeof state !== "string") {
    throw new BadRequestError("Missing id_token or state");
  }
  const logoutUri = await feideLogout(req, redirect, feideToken["id_token"]);
  return res.redirect(logoutUri);
});

router.get("/logout/session", (req, res) => {
  const domain = req.hostname === config.feideDomain ? `.${config.feideDomain}` : req.hostname;
  res.clearCookie("feide_auth", { domain });
  res.clearCookie("nodebb_auth", { domain });
  const state = typeof req.query.state === "string" ? req.query.state : "/";
  const { basepath, basename } = getLocaleInfoFromPath(state);
  const wasPrivateRoute = privateRoutes.some((r) => matchPath(r, basepath));
  const redirect = wasPrivateRoute || basepath === routes.myNdla.root ? constructNewPath("/", basename) : state;
  res.setHeader("Cache-Control", "private");
  return res.redirect(redirect);
});

router.get(["/subjects/*path", "/:lang/subjects/*path"], (req, res) => {
  const { lang, path } = req.params;
  res.redirect(301, lang ? `/${lang}/${path}` : `/${path}`);
});

router.get("/lti/config.xml", async (_req, res) => {
  res.removeHeader("X-Frame-Options");
  res.setHeader("Content-Type", "application/xml");
  res.send(ltiConfig());
});

router.get("/utdanningsprogram-sitemap.txt", async (_req, res) => {
  sendResponse(res, undefined, 410);
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

/** Handle different paths to a node in old ndla. */
["node", "printpdf", "easyreader", "contentbrowser/node", "print", "aktualitet", "oppgave", "fagstoff"].forEach(
  (path) => {
    router.get(
      [`/:lang/${path}/:nodeId`, `/:lang/${path}/:nodeId/*splat`, `/${path}/:nodeId`, `/${path}/:nodeId/*splat`],
      async (req, res, next) => forwardingRoute(req, res, next),
    );
  },
);

router.get("/*splat/search/apachesolr_search*secondsplat", (_, res) => {
  sendResponse(res, undefined, 410);
});

export default router;
