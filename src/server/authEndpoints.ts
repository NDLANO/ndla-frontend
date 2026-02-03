/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MyNDLAUserDTO } from "@ndla/types-backend/myndla-api";
import { getCookie } from "@ndla/util";
import express, { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  calculatePKCECodeChallenge,
  Configuration,
  discovery,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client";
import { matchPath } from "react-router";
import config from "../config";
import {
  AUTOLOGIN_COOKIE,
  FEIDE_ACCESS_TOKEN_COOKIE,
  FEIDE_ID_TOKEN_COOKIE,
  NODEBB_AUTH_COOKIE,
  NONCE_COOKIE,
  PKCE_CODE_COOKIE,
  RETURN_TO_COOKIE,
  SESSION_EXPIRY_COOKIE,
  STATE_COOKIE,
} from "../constants";
import { getLocaleInfoFromPath, isValidLocale } from "../i18n";
import { routes } from "../routeHelpers";
import { privateRoutes } from "../routes";
import { BAD_REQUEST } from "../statusCodes";
import { apiResourceUrl, resolveJsonOrRejectWithError } from "../util/apiHelpers";
import { isActiveSession } from "../util/authHelpers";
import { log } from "../util/logger/logger";
import { constructNewPath } from "../util/urlHelper";

const usernameSanitizerRegexp = new RegExp(/[^'"\s\-.*0-9\u00BF-\u1FFF\u2C00-\uD7FF\w]+/);

let storedOidcConfig: Configuration | undefined = undefined;

const OPENID_DOMAIN = "https://auth.dataporten.no/.well-known/openid-configuration";
const FEIDE_CLIENT_ID = process.env.FEIDE_CLIENT_ID ?? "";
const DEPLOYED = process.env.IS_VERCEL === "true" || process.env.NDLA_IS_KUBERNETES !== undefined;
const PROTOCOL = DEPLOYED ? "https" : "http";
const PORT = DEPLOYED ? "" : `:${config.port}`;
const SAME_SITE: CookieOptions["sameSite"] = DEPLOYED ? "lax" : undefined;
const NODEBB_DOMAIN = config.feideDomain ? `.${config.feideDomain}` : undefined;

const stateOptions: CookieOptions = { httpOnly: true, sameSite: DEPLOYED ? "none" : undefined, secure: DEPLOYED };
const pkceOptions: CookieOptions = { httpOnly: true, sameSite: DEPLOYED ? "none" : undefined, secure: DEPLOYED };
const nonceOptions: CookieOptions = { httpOnly: true, sameSite: DEPLOYED ? "none" : undefined, secure: DEPLOYED };
const returnToOptions: CookieOptions = { httpOnly: true, sameSite: DEPLOYED ? "none" : undefined, secure: DEPLOYED };
const accessTokenOptions: CookieOptions = { sameSite: SAME_SITE, secure: DEPLOYED };
const sessionExpiryOptions: CookieOptions = { sameSite: SAME_SITE, secure: DEPLOYED };
const nodeBbOptions: CookieOptions = { httpOnly: true, secure: DEPLOYED, domain: NODEBB_DOMAIN, sameSite: SAME_SITE };
const idTokenOptions: CookieOptions = { httpOnly: true, sameSite: SAME_SITE, secure: DEPLOYED };

const router = express.Router();

const clearTemporaryCookies = (res: Response) => {
  res.clearCookie(PKCE_CODE_COOKIE, pkceOptions);
  res.clearCookie(STATE_COOKIE, stateOptions);
  res.clearCookie(NONCE_COOKIE, nonceOptions);
  res.clearCookie(RETURN_TO_COOKIE, returnToOptions);
};

const isSafeRedirect = (url: string) => {
  try {
    const decodedUrl = decodeURIComponent(url).trim();
    return decodedUrl.startsWith("/") && !decodedUrl.startsWith("//");
  } catch (e) {
    return false;
  }
};

const getConfig = async (): Promise<Configuration> => {
  if (storedOidcConfig) {
    return storedOidcConfig;
  }
  log.info("Config does not exist. Trying to refetch");
  const oidcConfig = await discovery(new URL(OPENID_DOMAIN), FEIDE_CLIENT_ID);
  storedOidcConfig = oidcConfig;
  log.info("Config refetch:", oidcConfig ? "Success" : "Failed");
  return oidcConfig;
};

router.get(["/login", "/:lang/login"], async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  const activeSessionCookie = getCookie(SESSION_EXPIRY_COOKIE, req.headers.cookie ?? "");
  let returnTo = "/";
  if (typeof req.query.returnTo === "string" && isSafeRedirect(req.query.returnTo)) {
    returnTo = decodeURIComponent(req.query.returnTo);
  } else {
    const returnToCookie = getCookie(RETURN_TO_COOKIE, req.headers.cookie ?? "");
    if (returnToCookie && isSafeRedirect(returnToCookie)) {
      returnTo = decodeURIComponent(returnToCookie);
    }
  }

  const lang = req.params.lang ? (isValidLocale(req.params.lang) ? req.params.lang : config.defaultLocale) : undefined;
  const redirect = constructNewPath(returnTo, lang);

  if (activeSessionCookie && isActiveSession(activeSessionCookie)) {
    return res.redirect(redirect);
  }

  const codeVerifier = randomPKCECodeVerifier();
  const code_challenge = await calculatePKCECodeChallenge(codeVerifier);
  const oidcConfig = await getConfig();

  const redirect_uri = `${PROTOCOL}://${req.hostname}${PORT}/login/success`;
  const state = randomState();
  const nonce = randomNonce();

  const parameters: Record<string, string> = {
    redirect_uri,
    scope:
      "email openid profile userinfo-photo groups-edu userinfo-language userid userinfo-name groups-org userid-feide",
    code_challenge,
    code_challenge_method: "S256",
    state,
    nonce,
  };

  if (config.loginHint) {
    parameters.login_hint = config.loginHint;
  }

  const redirectUrl = buildAuthorizationUrl(oidcConfig, parameters);
  res.cookie(STATE_COOKIE, state, stateOptions);
  res.cookie(PKCE_CODE_COOKIE, codeVerifier, pkceOptions);
  res.cookie(NONCE_COOKIE, nonce, nonceOptions);
  res.cookie(RETURN_TO_COOKIE, redirect, returnToOptions);
  return res.redirect(redirectUrl.toString());
});

router.get("/login/success", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : undefined;
  res.setHeader("Cache-Control", "no-store");
  const verifier = getCookie(PKCE_CODE_COOKIE, req.headers.cookie ?? "");
  const state = getCookie(STATE_COOKIE, req.headers.cookie ?? "");
  const nonce = getCookie(NONCE_COOKIE, req.headers.cookie ?? "");
  const returnToCookie = getCookie(RETURN_TO_COOKIE, req.headers.cookie ?? "");
  const returnTo = returnToCookie && isSafeRedirect(returnToCookie) ? returnToCookie : "/";

  if (!code || !verifier || !state || !nonce) {
    clearTemporaryCookies(res);
    res.status(BAD_REQUEST).send({ error: "Missing code, state, nonce or verifier" });
    return;
  }

  if (req.query.state !== state) {
    clearTemporaryCookies(res);
    res.status(BAD_REQUEST).send({ error: "State does not match" });
    return;
  }

  const oidcConfig = await getConfig();

  const url = new URL(`${PROTOCOL}://${req.hostname}${PORT}${req.url}`);

  const tokens = await authorizationCodeGrant(oidcConfig, url, {
    pkceCodeVerifier: verifier,
    idTokenExpected: true,
    expectedState: state,
    expectedNonce: nonce,
  }).catch((error: Error) => {
    log.error("Error during authorization code grant:", error);
    clearTemporaryCookies(res);
    return Promise.reject(error);
  });

  const expiresInMs = (tokens.expiresIn() ?? 0) * 1000;

  res.cookie(FEIDE_ACCESS_TOKEN_COOKIE, tokens.access_token, {
    ...accessTokenOptions,
    maxAge: expiresInMs,
  });
  res.cookie(FEIDE_ID_TOKEN_COOKIE, tokens.id_token, {
    ...idTokenOptions,
    maxAge: expiresInMs,
  });
  res.cookie(SESSION_EXPIRY_COOKIE, (expiresInMs + Date.now()).toString(), {
    ...sessionExpiryOptions,
    maxAge: expiresInMs,
  });

  clearTemporaryCookies(res);

  // Set cookie for nodebb to use if user is arena enabled
  try {
    const response = await fetch(apiResourceUrl("/myndla-api/v1/users"), {
      headers: {
        FeideAuthorization: `Bearer ${tokens.access_token}`,
      },
    });
    const nodeBbSecret = process.env.NODEBB_SECRET;
    if (!nodeBbSecret && DEPLOYED) {
      throw new Error("NODEBB_SECRET is not defined");
    }
    const userInfo = await resolveJsonOrRejectWithError<MyNDLAUserDTO>(response);
    if (userInfo && userInfo.arenaEnabled) {
      const nodebbUser = {
        id: userInfo.feideId,
        username: userInfo.username?.replace(usernameSanitizerRegexp, "-"),
        fullname: userInfo.displayName,
        email: userInfo.email,
        groups: ["unverified-users"],
      };
      //fallback for local development
      const nodebbCookieString = jwt.sign(nodebbUser, nodeBbSecret ?? "secret");
      res.cookie(NODEBB_AUTH_COOKIE, nodebbCookieString, {
        ...nodeBbOptions,
        maxAge: (tokens.expiresIn() ?? 0) * 1000,
      });
    }
  } catch (error) {
    log.error("Failed to set cookie for nodebb autologin", { error });
  }

  if (config.autologinCookieEnabled) {
    // Set cookie to automatically send user to feide if present
    res.cookie(AUTOLOGIN_COOKIE, "true", { domain: NODEBB_DOMAIN });
  }
  return res.redirect(decodeURIComponent(returnTo));
});

router.get(["/logout", "/:lang/logout"], async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const idToken = getCookie(FEIDE_ID_TOKEN_COOKIE, req.headers.cookie ?? "") ?? "";
  if (req.query.returnTo && typeof req.query.returnTo === "string" && isSafeRedirect(req.query.returnTo)) {
    res.cookie(RETURN_TO_COOKIE, req.query.returnTo, returnToOptions);
  }

  const accessToken = getCookie(FEIDE_ACCESS_TOKEN_COOKIE, req.headers.cookie ?? "");
  if (!accessToken) {
    res.redirect("/");
    return;
  }

  const post_logout_redirect_uri = `${PROTOCOL}://${req.hostname}${PORT}/logout/session`;
  const oidcConfig = await getConfig();

  res.clearCookie(FEIDE_ID_TOKEN_COOKIE, idTokenOptions);
  res.clearCookie(FEIDE_ACCESS_TOKEN_COOKIE, accessTokenOptions);
  res.clearCookie(SESSION_EXPIRY_COOKIE, sessionExpiryOptions);
  res.clearCookie(NODEBB_AUTH_COOKIE, nodeBbOptions);

  const parameters: Record<string, string> = {
    post_logout_redirect_uri,
  };

  if (idToken) {
    parameters.id_token_hint = idToken;
  }

  const redirectUrl = buildEndSessionUrl(oidcConfig, parameters);

  return res.redirect(redirectUrl.toString());
});

router.get("/logout/session", (req, res) => {
  const returnToCookie = getCookie(RETURN_TO_COOKIE, req.headers.cookie ?? "");
  res.clearCookie(RETURN_TO_COOKIE, returnToOptions);
  const returnTo = returnToCookie && isSafeRedirect(returnToCookie) ? decodeURIComponent(returnToCookie) : "/";
  const { basepath, basename } = getLocaleInfoFromPath(returnTo);
  const wasPrivateRoute = privateRoutes.some((r) => matchPath(r, basepath));
  const redirect = wasPrivateRoute || basepath === routes.myNdla.root ? constructNewPath("/", basename) : returnTo;
  res.setHeader("Cache-Control", "no-store");
  return res.redirect(redirect);
});

export default router;
