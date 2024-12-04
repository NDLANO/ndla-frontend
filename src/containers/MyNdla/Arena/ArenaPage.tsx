/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddLine } from "@ndla/icons";
import { Button, Text, Heading } from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import SortableArenaCards from "./components/SortableArenaCards";
import { useArenaCategories } from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { MenuItemProps } from "../components/SettingsMenu";

const StyledContainer = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
  },
});

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
  const { loading, arenaCategories, refetch: refetchCategories } = useArenaCategories();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.arenaPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  if (loading) {
    return <PageSpinner />;
  }

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
      <StyledContainer>
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t("myNdla.arena.category.title")}</h2>
        </Heading>
        {!!user?.isModerator && (
          <ModeratorButtonWrapper>
            <Button size="small" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? t("myNdla.arena.admin.category.stopEditing") : t("myNdla.arena.admin.category.startEditing")}
            </Button>
            <SafeLinkButton size="small" to="category/new">
              {t("myNdla.arena.admin.category.form.newCategory")}
            </SafeLinkButton>
          </ModeratorButtonWrapper>
        )}
      </StyledContainer>
      {user ? (
        <SortableArenaCards
          isEditing={isEditing}
          categories={arenaCategories ?? []}
          user={user}
          refetchCategories={refetchCategories}
        />
      ) : null}
      <Text textStyle="label.medium">
        {t("myNdla.arena.bottomText")}
        <SafeLink to={`mailto:${t("myNdla.arena.moderatorEmail")}`}>{t("myNdla.arena.moderatorEmail")}</SafeLink>
      </Text>
    </StyledMyNdlaPageWrapper>
  );
};

export default ArenaPage;
