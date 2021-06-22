/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Issuer, generators } from 'openid-client';
import { Request } from 'express';
import config from '../../config';

const handleConfigTypes = (
  configVariable: string | boolean | undefined,
): string => {
  if (typeof configVariable === 'string') {
    return configVariable;
  }
  return '';
};

const OPENID_DOMAIN =
  'https://auth.dataporten.no/.well-known/openid-configuration';
const FEIDE_CLIENT_ID = handleConfigTypes(config.feideClientID);
const FEIDE_CLIENT_SECRET = handleConfigTypes(config.feideClientSecret);
const LOGIN_REDIRECT_URI = `https://ndla-frontend.test.api.ndla.no/login/success`;
const LOGOUT_REDIRECT_URI = `https://ndla-frontend.test.api.ndla.no/`;

const getIssuer = async () => await Issuer.discover(OPENID_DOMAIN);

const getClient = () =>
  getIssuer().then(
    issuer =>
      new issuer.Client({
        client_id: FEIDE_CLIENT_ID,
        client_secret: FEIDE_CLIENT_SECRET,
        redirect_uris: [LOGIN_REDIRECT_URI],
        response_types: ['code'],
      }),
  );

export const getRedirectUrl = () => {
  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);

  return getClient()
    .then(client =>
      client.authorizationUrl({
        scope:
          'email openid userinfo-photo groups-edu userinfo-language userid userinfo-name groups-org userid-feide',
        code_challenge,
      }),
    )
    .then(feide_url => {
      return { url: feide_url, verifier: code_verifier };
    });
};

export const getFeideToken = (req: Request) => {
  console.log(req.headers.cookie);
  return getClient().then(client => {
    const params = client.callbackParams(req);
    const verifier = req.headers.cookie?.split(';').filter(cookie => cookie.includes('PKCE_code'))[0]?.split('=')[1];
    console.log(verifier);
    return client.callback(LOGIN_REDIRECT_URI, params, {
      code_verifier: verifier,
    });
  });
};

export const feideLogout = (req: Request) => {
  return getClient().then(client =>
    client.endSessionUrl({
      id_token_hint: req.query.id_token_hint?.toString(),
      post_logout_redirect_uri: LOGOUT_REDIRECT_URI,
    }),
  );
};
