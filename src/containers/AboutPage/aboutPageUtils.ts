/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLAboutPage_FrontpageMenuFragment } from "../../graphqlTypes";

export const findBreadcrumb = (
  menu: GQLAboutPage_FrontpageMenuFragment[],
  slug: string | undefined,
  currentPath: GQLAboutPage_FrontpageMenuFragment[] = [],
): GQLAboutPage_FrontpageMenuFragment[] => {
  for (const item of menu) {
    const newPath = currentPath.concat(item);
    if (item.article.slug?.toLowerCase() === slug?.toLowerCase()) {
      return newPath;
    } else if (item.menu?.length) {
      const foundPath = findBreadcrumb(item.menu as GQLAboutPage_FrontpageMenuFragment[], slug, newPath);
      if (foundPath.length) {
        return foundPath;
      }
    }
  }
  return [];
};
