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
import { UserLine, AlertLine } from "@ndla/icons/common";
import { Heading, Text } from "@ndla/primitives";
import { css } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import AdminNavLink from "./components/AdminNavLink";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledCardContainer = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    paddingBlock: "large",
  },
});

const PageWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    paddingBlock: "large",
  },
});

const iconStyles = css.raw({
  color: "icon.strong",
  display: "none",
  mobileWide: {
    display: "block",
  },
});

const ArenaAdminPage = () => {
  const { t } = useTranslation();
  const { authContextLoaded, authenticated, user } = useContext(AuthContext);

  if (!authContextLoaded) return <PageSpinner />;

  if (!authenticated || (user && !(user.arenaEnabled || user.isModerator))) return <Navigate to={routes.myNdla.root} />;

  return (
    <MyNdlaPageWrapper>
      <PageWrapper>
        <HelmetWithTracker title={t("htmlTitles.arenaAdminPage")} />
        <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.small">
          {t("myNdla.arena.admin.title")}
        </Heading>
        <Text>{t("myNdla.arena.admin.description")}</Text>
        <StyledCardContainer>
          <AdminNavLink
            to={"flags"}
            title={t("myNdla.arena.admin.flags.title")}
            subText={t("myNdla.arena.admin.flags.description")}
            icon={<AlertLine css={iconStyles} />}
          />
          <AdminNavLink
            to={"users"}
            title={t("myNdla.arena.admin.users.title")}
            subText={t("myNdla.arena.admin.users.shortDescription")}
            icon={<UserLine css={iconStyles} />}
          />
        </StyledCardContainer>
      </PageWrapper>
    </MyNdlaPageWrapper>
  );
};

export default ArenaAdminPage;
