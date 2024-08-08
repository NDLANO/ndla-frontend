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
import { Navigate } from "react-router-dom";
import { Button, Spinner, Text, Heading } from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { TopicActions, TopicButtons } from "./ArenaToolbar";
import SortableArenaCards from "./components/SortableArenaCards";
import { useArenaCategories } from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledContainer = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "large",
    marginBottom: "medium",
  },
});

const StyledHeading = styled(Heading, {
  base: {
    marginTop: "large",
    marginBottom: "medium",
  },
});

export const ModeratorButtonWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "3xsmall",
  },
});

const ArenaPage = () => {
  const { t } = useTranslation();
  const { loading, arenaCategories, refetch: refetchCategories } = useArenaCategories();
  const { trackPageView } = useTracker();
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled) return;
    trackPageView({
      title: t("htmlTitles.arenaPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  if (loading || !authContextLoaded) {
    return <Spinner />;
  }

  if (!authenticated || (user && !user.arenaEnabled)) return <Navigate to={routes.myNdla.root} />;

  return (
    <MyNdlaPageWrapper
      buttons={user?.isModerator && <TopicButtons />}
      dropDownMenu={user?.isModerator && <TopicActions />}
    >
      <HelmetWithTracker title={t("htmlTitles.arenaPage")} />
      <StyledHeading id={SKIP_TO_CONTENT_ID} textStyle="heading.small">
        {t("myNdla.arena.title")}
      </StyledHeading>
      <Text>{parse(t("myNdla.arena.notification.description"))}</Text>
      <StyledContainer>
        <Heading textStyle="title.large" asChild consumeCss>
          <h2>{t("myNdla.arena.category.title")}</h2>
        </Heading>
        {user?.isModerator && (
          <ModeratorButtonWrapper>
            <Button size="small" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? t("myNdla.arena.admin.category.stopEditing") : t("myNdla.arena.admin.category.startEditing")}
            </Button>
            <SafeLinkButton to="category/new">{t("myNdla.arena.admin.category.form.newCategory")}</SafeLinkButton>
          </ModeratorButtonWrapper>
        )}
      </StyledContainer>
      {loading || !user ? (
        <Spinner />
      ) : (
        <SortableArenaCards
          isEditing={isEditing}
          categories={arenaCategories ?? []}
          user={user}
          refetchCategories={refetchCategories}
        />
      )}
      <Text textStyle="body.small">
        {t("myNdla.arena.bottomText")}
        <SafeLink to={`mailto:${t("myNdla.arena.moderatorEmail")}`}>{t("myNdla.arena.moderatorEmail")}</SafeLink>
      </Text>
    </MyNdlaPageWrapper>
  );
};

export default ArenaPage;
