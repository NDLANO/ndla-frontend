/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { AddLine } from "@ndla/icons/action";
import { Text, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { MenuItemProps } from "../components/SettingsMenu";

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledMyNdlaPageWrapper = styled(MyNdlaPageWrapper, {
  base: {
    gap: "medium",
  },
});

export const ModeratorButtonWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "3xsmall",
  },
});

const ArenaPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled) return;
    trackPageView({
      title: t("htmlTitles.arenaPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  if (!authenticated || (user && !user.arenaEnabled)) return <Navigate to={routes.myNdla.root} />;

  const menuItems: MenuItemProps[] = [
    {
      type: "link",
      value: "newCategory",
      icon: <AddLine size="small" />,
      text: t("myNdla.arena.admin.category.form.newCategory"),
      link: "category/new",
    },
  ];

  return (
    <StyledMyNdlaPageWrapper menuItems={user?.isModerator ? menuItems : []}>
      <HelmetWithTracker title={t("htmlTitles.arenaPage")} />
      <HeadingWrapper>
        <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
          {t("myNdla.arena.title")}
        </Heading>
        <Text textStyle="body.xlarge">{parse(t("myNdla.arena.notification.description"))}</Text>
      </HeadingWrapper>
      <iframe title="Arena" src="https://grupper.test.ndla.no" width="100%" height="1000" allowFullScreen />
    </StyledMyNdlaPageWrapper>
  );
};

export default ArenaPage;
