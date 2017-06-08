/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import btoa from 'btoa';
import config from '../src/config';

const NDLA_API_URL = config.ndlaApiUrl;

const url = `${NDLA_API_URL}/auth/tokens`;

const ndlaFrontendClientId =
  process.env.NDLA_FRONTEND_CLIENT_ID || 'swagger-client';
const ndlaFrontendClientSecret =
  process.env.NDLA_FRONTEND_CLIENT_SECRET || 'swagger-public-client-secret';

const b64EncodeUnicode = str =>
  btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(`0x${p1}`),
    ),
  );

export const getToken = () =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: `Basic ${b64EncodeUnicode(
        `${ndlaFrontendClientId}:${ndlaFrontendClientSecret}`,
      )}`,
    },
    body: 'grant_type=client_credentials',
  }).then(res => res.json());
