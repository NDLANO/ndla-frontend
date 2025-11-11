/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

declare const __IS_CLIENT__: boolean | undefined;
declare const __IS_PRODUCTION__: boolean | undefined;
declare const __IS_TEST__: boolean | undefined;

function detectIsClient(): boolean {
  return typeof window !== "undefined";
}

function detectIsProduction(): boolean {
  return typeof process !== "undefined" ? process.env.NODE_ENV === "production" : false;
}

// These are the exported constants
export const IS_CLIENT: boolean = typeof __IS_CLIENT__ !== "undefined" ? __IS_CLIENT__ : detectIsClient();

export const IS_PRODUCTION: boolean =
  typeof __IS_PRODUCTION__ !== "undefined" ? __IS_PRODUCTION__ : detectIsProduction();

export const IS_TEST: boolean = typeof __IS_TEST__ !== "undefined" ? __IS_TEST__ : false;
