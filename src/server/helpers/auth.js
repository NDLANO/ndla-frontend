/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import handleError from '../../util/handleError';
import { getEnvironmentVariabel } from '../../config';

const url = `https://ndla.eu.auth0.com/oauth/token`;

const ndlaFrontendClientId = getEnvironmentVariabel(
  'NDLA_FRONTEND_CLIENT_ID',
  'IxLzDBlvwmHBUMfLaGfJshD6Kahb362L',
);
const ndlaFrontendClientSecret = getEnvironmentVariabel(
  'NDLA_FRONTEND_CLIENT_SECRET',
  'w9P-niyBUZK9fadBt5yNkG-7KMBULm59HB8GnJJPgwvT_gwlG98nfvdik2sVW9d_',
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
