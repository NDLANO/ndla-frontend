/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { toAbout } from "../../routeHelpers";

interface BaseMenuType {
  article: {
    slug?: string;
    title: string;
  };
  menu?: BaseMenuType[];
}

export const findBreadcrumb = <T extends BaseMenuType>(
  menu: T[] | undefined,
  slug: string | undefined,
  currentPath: T[] = [],
): T[] => {
  for (const item of menu ?? []) {
    const newPath = currentPath.concat(item);
    if (item.article.slug?.toLowerCase() === slug?.toLowerCase()) {
      return newPath;
    } else if (item.menu?.length) {
      const foundPath = findBreadcrumb(item.menu as T[], slug, newPath);
      if (foundPath.length) {
        return foundPath;
      }
    }
  }
  return [];
};

export const getBreadcrumb = <T extends BaseMenuType>(crumbs: T[], t: TFunction) => {
  return [
    {
      name: t("breadcrumb.toFrontpage"),
      to: "/",
    },
  ].concat(
    crumbs.map((crumb) => ({
      name: crumb.article.title,
      to: toAbout(crumb.article.slug),
    })),
  );
};
