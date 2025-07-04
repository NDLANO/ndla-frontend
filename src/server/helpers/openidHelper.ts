/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Request } from "express";
import { Issuer, generators, Client } from "openid-client";
import config, { getEnvironmentVariabel } from "../../config";
import log from "../../util/logger";

const handleConfigTypes = (configVariable: string | boolean | undefined): string => {
  if (typeof configVariable === "string") {
    return configVariable;
  }
  return "";
};

const OPENID_DOMAIN = "https://auth.dataporten.no/.well-known/openid-configuration";
const FEIDE_CLIENT_ID = handleConfigTypes(getEnvironmentVariabel("FEIDE_CLIENT_ID"));
const FEIDE_CLIENT_SECRET = handleConfigTypes(getEnvironmentVariabel("FEIDE_CLIENT_SECRET"));

let storedIssuer: Issuer<Client>;

const getIssuer = async () => {
  if (storedIssuer) {
    return storedIssuer;
  }
  log.info("Issuer does not exist. Trying to refetch");
  storedIssuer = await Issuer.discover(OPENID_DOMAIN);
  log.info("Issuer refetch:", storedIssuer ? "Success" : "Failed");
  return storedIssuer;
};

const getClient = (redirect_uri: string) =>
  getIssuer().then(
    (issuer) =>
      new issuer.Client({
        client_id: FEIDE_CLIENT_ID,
        client_secret: FEIDE_CLIENT_SECRET,
        redirect_uris: [redirect_uri],
        response_types: ["code"],
      }),
  );

export const getRedirectUrl = (req: Request, state: string) => {
  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);
  const port = req.protocol === "http" ? `:${config.port}` : "";
  const redirect_uri_login = `${req.protocol}://${req.hostname}${port}/login/success`;

  return getClient(redirect_uri_login)
    .then((client) =>
      client.authorizationUrl({
        scope: "email openid userinfo-photo groups-edu userinfo-language userid userinfo-name groups-org userid-feide",
        code_challenge,
        state: state,
        login_hint: config.loginHint,
      }),
    )
    .then((feide_url) => {
      return { url: feide_url, verifier: code_verifier };
    });
};

export const getFeideToken = (req: Request, verifier: string, code: string) => {
  const port = req.protocol === "http" ? `:${config.port}` : "";
  const redirect_uri_login = `${req.protocol}://${req.hostname}${port}/login/success`;
  return getClient(redirect_uri_login).then((client) => {
    const params = client.callbackParams(`login/success?code=${code}`);
    return client.callback(redirect_uri_login, params, {
      code_verifier: verifier,
    });
  });
};

export const feideLogout = (req: Request, state: string, idToken: string) => {
  const port = req.protocol === "http" ? `:${config.port}` : "";
  const redirect_uri_logout = `${req.protocol}://${req.hostname}${port}/logout/session`;
  return getClient(redirect_uri_logout).then((client) =>
    client.endSessionUrl({
      id_token_hint: idToken,
      post_logout_redirect_uri: redirect_uri_logout,
      state: state,
    }),
  );
};
