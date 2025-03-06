/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TokenSetParameters } from "openid-client";
import { getCookie } from "@ndla/util";

interface FeideCookie extends TokenSetParameters {
  ndla_expires_at: number;
}

export const getFeideCookie = (cookies: string): FeideCookie | null => {
  const cookieString = getCookie("feide_auth", cookies);
  if (cookieString) {
    return JSON.parse(cookieString);
  }

  return null;
};

const getFeideCookieClient = (): FeideCookie | null => {
  return getFeideCookie(document.cookie);
};

export const millisUntilExpiration = (cookie: FeideCookie | null = getFeideCookieClient()): number => {
  const expiration = cookie?.ndla_expires_at ?? 0;
  const currentTime = new Date().getTime();

  return Math.max(0, expiration - currentTime);
};

export const isAccessTokenValid = (cookie: FeideCookie | null = getFeideCookieClient()): boolean => {
  return millisUntilExpiration(cookie) > 10000;
};
