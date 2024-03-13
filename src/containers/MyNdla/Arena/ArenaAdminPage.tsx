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
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { ProfilePersonOutlined, WarningOutline } from "@ndla/icons/common";
import { HelmetWithTracker } from "@ndla/tracker";
import { Heading, Text } from "@ndla/typography";
import AdminNavLink from "./components/AdminNavLink";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledCardContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0;
`;

const ArenaAdminPage = () => {
  const { t } = useTranslation();
  const { authContextLoaded, authenticated, user } = useContext(AuthContext);

  if (authContextLoaded && (!authenticated || !user?.arenaEnabled || !user?.isModerator))
    return <Navigate to={routes.myNdla.root} />;

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.arenaAdminPage")} />
      <Heading element="h1" id={SKIP_TO_CONTENT_ID} headingStyle="h1-resource" margin="small">
        {t("myNdla.arena.admin.title")}
      </Heading>
      <Text element="p" textStyle="content-alt">
        {t("myNdla.arena.admin.description")}
      </Text>
      <StyledCardContainer>
        <AdminNavLink
          to={"flags"}
          title={t("myNdla.arena.admin.flags.title")}
          subText={t("myNdla.arena.admin.flags.description")}
          icon={<WarningOutline />}
        />
        <AdminNavLink
          to={"users"}
          title={t("myNdla.arena.admin.users.title")}
          subText={t("myNdla.arena.admin.users.shortDescription")}
          icon={<ProfilePersonOutlined />}
        />
      </StyledCardContainer>
    </MyNdlaPageWrapper>
  );
};

export default ArenaAdminPage;
