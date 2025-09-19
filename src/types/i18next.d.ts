/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18n as originalI18n } from "i18next";
import { LocaleType } from "../interfaces";

declare module "i18next" {
  export interface i18n extends Omit<originalI18n, "language"> {
    language: LocaleType;
  }
}
