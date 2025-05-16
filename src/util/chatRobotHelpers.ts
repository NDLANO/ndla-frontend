/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getNdlaRobotDateFormat } from "./formatDate";

export const getChatRobotUrl = () => {
  const dateString = getNdlaRobotDateFormat(new Date());
  const token = btoa(dateString);
  return `https://ndla-ki.no/${token}`;
};
