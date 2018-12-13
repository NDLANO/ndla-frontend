/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import handleError from '../../util/handleError';
import { getEnvironmentVariabel, getUniversalConfig } from '../../config';

const url = `https://${getUniversalConfig().auth0Hostname}/oauth/token`;

const ndlaFrontendClientId = getEnvironmentVariabel(
  'NDLA_FRONTEND_CLIENT_ID',
  'XVtdp6Ik4kdLDjMTQE2CIxnGB6Gvhr2n',
);
const ndlaFrontendClientSecret = getEnvironmentVariabel(
  'NDLA_FRONTEND_CLIENT_SECRET',
  'YDNh0ppJnSKdq_yzVQIrUGtvdPkieprruBFwY7Sq5HReaiADfvXKOnm41wfrq8X9',
);

export async function getToken() {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: `${ndlaFrontendClientId}`,
      client_secret: `${ndlaFrontendClientSecret}`,
      audience: 'ndla_system',
    }),
    json: true,
  });

  if (response.ok) {
    return response.json();
  }

  handleError(await response.text());

  throw new Error('Failed to fetch token from auth0');
}
