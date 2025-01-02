/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Heading, Text } from "@ndla/primitives";
import { HelmetWithTracker } from "@ndla/tracker";
import Users from "./components/Users";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const ArenaFlagPage = () => {
  const { t } = useTranslation();

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.arenaAdminPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[
          {
            name: t("myNdla.arena.admin.users.title"),
            id: `flags`,
          },
        ]}
        page="admin"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="title.large">
        {t("myNdla.arena.admin.users.title")}
      </Heading>
      <Text>{t("myNdla.arena.admin.users.description")}</Text>
      <Users />
    </MyNdlaPageWrapper>
  );
};

export default ArenaFlagPage;
