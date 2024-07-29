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
import { Spinner } from "@ndla/primitives";
import { HelmetWithTracker } from "@ndla/tracker";
import { Heading, Text } from "@ndla/typography";
import Users from "./components/Users";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0;
`;

const ArenaFlagPage = () => {
  const { t } = useTranslation();
  const { authContextLoaded, authenticated, user } = useContext(AuthContext);

  if (!authContextLoaded) {
    return <Spinner />;
  }

  if (!authenticated || (user && !(user.arenaEnabled || user.isModerator)))
    return <Navigate to={routes.myNdla.arena} />;

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
      <Heading element="h1" id={SKIP_TO_CONTENT_ID} headingStyle="h1-resource" margin="small">
        {t("myNdla.arena.admin.users.title")}
      </Heading>
      <Text element="p" textStyle="content-alt">
        {t("myNdla.arena.admin.users.description")}
      </Text>
      <StyledCardContainer>
        <Users />
      </StyledCardContainer>
    </MyNdlaPageWrapper>
  );
};

export default ArenaFlagPage;
