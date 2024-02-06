/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GQLName } from "../../graphqlTypes";

export const findName = (themeNames: GQLName[], language: string) => {
  const themeName = themeNames.find((name) => name.language === language);
  if (themeName) {
    return themeName.name;
  }
  const fallback = themeNames.find((name) => name.language === "nb");
  if (fallback) {
    return fallback.name;
  }
  return "";
};
