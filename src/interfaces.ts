/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import {ConfigType} from "./config";

export interface WindowData {
  config: ConfigType;
  initialProps: {};
  serverPath?: string;
  serverQuery?: {
    [key: string]: string | number | boolean | undefined | null;
  }

}

