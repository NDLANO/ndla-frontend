/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from "express";
import jwt from "jsonwebtoken";
import { errors as oidcErrors } from "openid-client";
import { matchPath } from "react-router-dom";
import { IMyNDLAUserDTO } from "@ndla/types-backend/myndla-api";
import { getCookie } from "@ndla/util";
import { generateOauthData } from "./helpers/oauthHelper";
import { feideLogout, getFeideToken, getRedirectUrl } from "./helpers/openidHelper";
import ltiConfig from "./ltiConfig";
import { contextRedirectRoute } from "./routes/contextRedirectRoute";
import { forwardingRoute } from "./routes/forwardingRoute";
import { oembedArticleRoute } from "./routes/oembedArticleRoute";
import { podcastFeedRoute } from "./routes/podcastFeedRoute";
import { sendResponse } from "./serverHelpers";
import config, { getEnvironmentVariabel } from "../config";
import { ABOUT_PATH, AUTOLOGIN_COOKIE, FILM_PAGE_URL, UKR_PAGE_URL, programmeRedirects } from "../constants";
import { getLocaleInfoFromPath, isValidLocale } from "../i18n";
import { routes } from "../routeHelpers";
import { privateRoutes } from "../routes";
import { BAD_REQUEST } from "../statusCodes";
import { isAccessTokenValid } from "../util/authHelpers";
import { BadRequestError } from "../util/error/StatusError";
import { apiResourceUrl, resolveJsonOrRejectWithError } from "../util/apiHelpers";
import log from "../util/logger";
import { constructNewPath } from "../util/urlHelper";

const usernameSanitizerRegexp = new RegExp(/[^'"\s\-.*0-9\u00BF-\u1FFF\u2C00-\uD7FF\w]+/);
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
  const { status, data } = await oembedArticleRoute(req);
  sendResponse(req, res, data, status);
});

router.get(["/:lang/login", "/login"], async (req, res) => {
  const feideCookie = getCookie("feide_auth", req.headers.cookie ?? "") ?? "";
  const feideToken = feideCookie ? JSON.parse(feideCookie) : undefined;
  const state = typeof req.query.state === "string" ? req.query.state : "";
  res.setHeader("Cache-Control", "private");
  const lang = isValidLocale(req.params.lang) ? req.params.lang : config.defaultLocale;
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
    if (error instanceof oidcErrors.OPError) {
      log.info("Got OPError when fetching feide token.", { error });
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

  // Set cookie for nodebb to use if user is arena enabled
  try {
    const response = await fetch(apiResourceUrl("/myndla-api/v1/users"), {
      headers: {
        FeideAuthorization: `Bearer ${token.access_token}`,
      },
    });
    const userInfo = await resolveJsonOrRejectWithError<IMyNDLAUserDTO>(response);
    if (userInfo && userInfo.arenaEnabled) {
      const nodebbUser = {
        id: userInfo.feideId,
        username: userInfo.username?.replace(usernameSanitizerRegexp, "-"),
        fullname: userInfo.displayName,
        email: userInfo.email,
        groups: ["unverified-users"],
      };
      const nodebbCookieString = jwt.sign(nodebbUser, getEnvironmentVariabel("NODEBB_SECRET", "secret"));
      res.cookie("nodebb_auth", nodebbCookieString, { expires: new Date(feideCookie.ndla_expires_at), domain });
    }
  } catch (error) {
    log.error("Failed to set cookie for nodebb autologin", { error });
  }

  if (config.autologinCookieEnabled) {
    // Set cookie to automatically send user to feide if present
    res.cookie(AUTOLOGIN_COOKIE, "true", { domain });
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

router.get("/*splat/search/apachesolr_search*secondsplat", (req, res) => {
  sendResponse(req, res, undefined, 410);
});

export default router;
