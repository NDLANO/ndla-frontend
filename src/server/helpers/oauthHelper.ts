/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import crypto from 'crypto';
import { getEnvironmentVariabel } from '../../config';

export const generateOauthData = (url: string, body: any) => {
  const consumerSecret = getEnvironmentVariabel(
    'NDLA_LTI_OAUTH_SECRET_KEY',
    '',
  );
  const nonce = crypto.randomBytes(16).toString('base64');

  const data = { ...body, oauth_nonce: nonce };
  const sortedBody: Record<string, any> = {};
  Object.keys(data)
    .sort()
    .forEach(function(key) {
      sortedBody[key] = data[key] || '';
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

  return { oauth_signature: hashedBaseString, oauth_nonce: nonce };
};
