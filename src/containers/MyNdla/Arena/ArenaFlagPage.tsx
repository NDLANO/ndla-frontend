/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { Heading, Text } from "@ndla/primitives";
import { HelmetWithTracker } from "@ndla/tracker";
import FlaggedPosts from "./components/FlaggedPosts";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const ArenaFlagPage = () => {
  const { t } = useTranslation();
  const { authContextLoaded, authenticated, user } = useContext(AuthContext);

  if (!authContextLoaded) return <PageSpinner />;

  if (!authenticated || (user && !(user.arenaEnabled || user.isModerator)))
    return <Navigate to={routes.myNdla.arena} />;

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.arenaAdminPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[
          {
            name: t("myNdla.arena.admin.flags.title"),
            id: `flags`,
          },
        ]}
        page="admin"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="title.large">
        {t("myNdla.arena.admin.flags.title")}
      </Heading>
      <Text>{t("myNdla.arena.admin.flags.description")}</Text>
      <FlaggedPosts />
    </MyNdlaPageWrapper>
  );
};

export default ArenaFlagPage;
