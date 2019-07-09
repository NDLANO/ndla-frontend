/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import crypto from 'crypto';
import { getEnvironmentVariabel } from '../../config';

export const generateOauthSignature = (url, body) => {
  const consumerSecret = getEnvironmentVariabel(
    'NDLA_LTI_OAUTH_SECRET_KEY',
    '',
  );
  const sortedBody = {};
  Object.keys(body)
    .sort()
    .forEach(function(key) {
      sortedBody[key] = body[key] || '';
    });

  const params = Object.keys(sortedBody)
    .map(key => `${key}=${encodeURIComponent(sortedBody[key])}`)
    .join('&');

  const signatureBaseString = `POST&${encodeURIComponent(
    url,
  )}&${encodeURIComponent(params)}`;

  const hashedBaseString = crypto
    .createHmac('SHA256', `${consumerSecret}&`) //& because there could be a token there, but it is not...
    .update(signatureBaseString)
    .digest('base64');
  return hashedBaseString;
};
