/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";

export const sortSubjectsByRecentlyFavourited = <T extends { id: string }>(
  subject: T[],
  favouriteSubjects: string[],
): T[] => {
  const keyedSubjects = keyBy(subject, "id");
  return favouriteSubjects.map((id) => keyedSubjects[id]).filter(Boolean) as T[];
};
