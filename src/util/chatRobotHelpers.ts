/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../config";
import type { GQLMyNdlaPersonalDataFragmentFragment } from "../graphqlTypes";
import { getNdlaRobotDateFormat } from "./formatDate";

export const getChatRobotUrl = (user: GQLMyNdlaPersonalDataFragmentFragment | undefined) => {
  const dateString = getNdlaRobotDateFormat(new Date());
  const token = user ? btoa(dateString) : "";
  return config.disableKiToken ? "https://ndla-ki.no/" : `https://ndla-ki.no/${token}`;
};
