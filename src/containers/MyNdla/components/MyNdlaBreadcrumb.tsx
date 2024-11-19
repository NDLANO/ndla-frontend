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
import { routes } from "../../../routeHelpers";

interface Props {
  breadcrumbs: GQLBreadcrumb[];
  page: PageType;
}

type PageType = "folders" | "subjects" | "arena" | "admin";

const types = {
  folders: {
    to: routes.myNdla.folders,
    name: "myNdla.myFolders",
  },
  subjects: {
    to: routes.myNdla.subjects,
    name: "myNdla.favoriteSubjects",
  },
  arena: {
    to: routes.myNdla.arena,
    name: "myNdla.arena.title",
  },
  admin: {
    to: routes.myNdla.admin,
    name: "myNdla.arena.admin.title",
  },
};

const MyNdlaBreadcrumb = ({ breadcrumbs, page }: Props) => {
  const { t } = useTranslation();

  const baseCrumb = types[page];
  const crumbs = [{ to: baseCrumb.to, name: t(baseCrumb.name) }].concat(
    breadcrumbs.map((bc) => ({
      name: bc.name,
      to: `${routes.myNdla.root}/${page}/${bc.id}`,
    })),
  );

  if (breadcrumbs.length > 0) {
    return <Breadcrumb items={crumbs} />;
  }
  return null;
};

export default MyNdlaBreadcrumb;
