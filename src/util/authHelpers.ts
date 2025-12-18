/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getCookie } from "@ndla/util";
import { FEIDE_ACCESS_TOKEN_COOKIE, SESSION_EXPIRY_COOKIE } from "../constants";

export const getFeideCookie = (cookies: string) => {
  return getCookie(FEIDE_ACCESS_TOKEN_COOKIE, cookies);
};

export const getActiveSessionCookieClient = () => {
  return getCookie(SESSION_EXPIRY_COOKIE, document.cookie);
};

export const millisUntilExpiration = (sessionExpiry: string | undefined | null): number => {
  const parsedExpiry = sessionExpiry ? Number(sessionExpiry) : 0;
  if (!parsedExpiry) return 0;
  return Math.max(0, parsedExpiry - new Date().getTime());
};

export const isActiveSession = (sessionExpiry: string | undefined): boolean => {
  return millisUntilExpiration(sessionExpiry) > 10000;
};
