/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@ndla/ui";
import { GQLBreadcrumb } from "../../../graphqlTypes";
import { myNdlaRoutes } from "../../../routeHelpers";

interface Props {
  breadcrumbs: GQLBreadcrumb[];
  page: PageType;
}

type PageType = "folders" | "tags" | "subjects" | "arena" | "admin";

const types = {
  folders: {
    to: myNdlaRoutes.myNdlaFolders,
    name: "myNdla.myFolders",
  },
  tags: {
    to: myNdlaRoutes.myNdlaTags,
    name: "myNdla.myTags",
  },
  subjects: {
    to: myNdlaRoutes.myNdlaSubjects,
    name: "myNdla.favoriteSubjects",
  },
  arena: {
    to: myNdlaRoutes.myNdlaArena,
    name: "myNdla.arena.title",
  },
  admin: {
    to: myNdlaRoutes.myNdlaAdmin,
    name: "myNdla.arena.admin.title",
  },
};

const MyNdlaBreadcrumb = ({ breadcrumbs, page }: Props) => {
  const { t } = useTranslation();

  const baseCrumb = types[page];
  const crumbs = [{ to: baseCrumb.to, name: t(baseCrumb.name) }].concat(
    breadcrumbs.map((bc) => ({
      name: bc.name,
      to: `${myNdlaRoutes.myNdla}/${page}/${bc.id}`,
    })),
  );

  if (breadcrumbs.length > 0) {
    return <Breadcrumb items={crumbs} />;
  }
  return null;
};

export default MyNdlaBreadcrumb;
