/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const urlIsNDLAApiUrl = (url: string) =>
  /^(http|https):\/\/(ndla-frontend|www).([a-zA-Z]+.)?api.ndla.no/.test(url);
export const urlIsNDLAEnvUrl = (url: string) => /^(http|https):\/\/(www.)?([a-zA-Z]+.)?ndla.no/.test(url);
export const urlIsLocalNdla = (url: string) => /^http:\/\/(proxy.ndla-local|localhost):30017/.test(url);
export const urlIsNDLAUrl = (url: string) => urlIsNDLAApiUrl(url) || urlIsNDLAEnvUrl(url) || urlIsLocalNdla(url);
