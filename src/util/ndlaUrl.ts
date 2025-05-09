/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const NDLA_API_URL_REGEX = /^(http|https):\/\/(ndla-frontend|www).([a-zA-Z]+.)?api.ndla.no/;
const NDLA_ENV_URL_REGEX = /^(http|https):\/\/(www.)?([a-zA-Z]+.)?ndla.no/;
const NDLA_LOCAL_URL_REGEX = /^http:\/\/(proxy.ndla-local|localhost):30017/;

export const urlIsNDLAUrl = (url: string) =>
  NDLA_API_URL_REGEX.test(url) || NDLA_ENV_URL_REGEX.test(url) || NDLA_LOCAL_URL_REGEX.test(url);
