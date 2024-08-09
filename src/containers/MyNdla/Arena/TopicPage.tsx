/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { EyeFill } from "@ndla/icons/editor";
import { Button, Heading, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { ModeratorButtonWrapper } from "./ArenaPage";
import { PostActions, PostButtons } from "./ArenaToolbar";
import SortableArenaCards from "./components/SortableArenaCards";
import { useArenaCategory } from "./components/temporaryNodebbHooks";
import TopicCard from "./components/TopicCard";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const BreadcrumbWrapper = styled("div", {
  base: {
    paddingTop: "medium",
  },
});

const ListWrapper = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    margin: "0",
    padding: "0",
  },
});

const StyledContainer = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0",
    marginBottom: "xlarge",
    marginTop: "medium",
  },
});

const StyledCardContainer = styled("li", {
  base: {
    display: "flex",
    flexDirection: "column",
    padding: "0",
  },
});

const HeaderWrapper = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
});

const StyledEye = styled(EyeFill, {
  base: {
    height: "medium",
    marginLeft: "xxsmall",
    width: "medium",
  },
});

const ButtonContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "3xsmall",
  },
});

const StyledHeading = styled(Heading, {
  base: {
    marginTop: "large",
    marginBottom: "medium",
  },
});

const TopicPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { trackPageView } = useTracker();

  const { loading, arenaCategory, refetch: refetchCategory } = useArenaCategory(categoryId);
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || !loading) return;
    trackPageView({
      title: t("htmlTitles.arenaTopicPage", { name: arenaCategory?.title }),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaCategory?.title, authContextLoaded, loading, t, trackPageView, user]);

  if (loading || !authContextLoaded) return <PageSpinner />;
  if (!authenticated || (user && !user.arenaEnabled)) return <Navigate to={routes.myNdla.root} />;
  if (!arenaCategory) return <Navigate to={routes.myNdla.arena} />;
  const crumbs = arenaCategory.breadcrumbs?.map((crumb) => ({ name: crumb.title, id: `category/${crumb.id}` })) ?? [];
  const showCategories = !!arenaCategory.subcategories?.length || user?.isModerator;

  return (
    <MyNdlaPageWrapper buttons={<PostButtons />} dropDownMenu={<PostActions />}>
      <HelmetWithTracker title={t("htmlTitles.arenaTopicPage", { name: arenaCategory?.title })} />
      <BreadcrumbWrapper>
        <MyNdlaBreadcrumb breadcrumbs={crumbs} page={"arena"} />
      </BreadcrumbWrapper>
      <HeaderWrapper>
        <StyledHeading id={SKIP_TO_CONTENT_ID} textStyle="heading.small">
          {arenaCategory?.title}
          {user?.isModerator && !arenaCategory?.visible && (
            <StyledEye
              title={t("myNdla.arena.admin.category.notVisible")}
              aria-label={t("myNdla.arena.admin.category.notVisible")}
              aria-hidden={false}
            />
          )}
        </StyledHeading>
      </HeaderWrapper>
      <Text>{arenaCategory?.description}</Text>
      {showCategories && (
        <>
          <StyledContainer>
            <Heading textStyle="title.large" asChild consumeCss>
              <h2>{t("myNdla.arena.category.subcategory")}</h2>
            </Heading>
            {user?.isModerator && (
              <ModeratorButtonWrapper>
                <Button size="small" onClick={() => setIsEditing((prev) => !prev)}>
                  {isEditing
                    ? t("myNdla.arena.admin.category.stopEditing")
                    : t("myNdla.arena.admin.category.startEditing")}
                </Button>
                <SafeLinkButton to={`/minndla/arena/category/new?parent-id=${arenaCategory.id}`}>
                  {t("myNdla.arena.admin.category.form.newCategory")}
                </SafeLinkButton>
              </ModeratorButtonWrapper>
            )}
          </StyledContainer>
          {arenaCategory.subcategories && (
            <SortableArenaCards
              isEditing={isEditing}
              categories={arenaCategory?.subcategories ?? []}
              user={user}
              categoryParentId={arenaCategory.id}
              refetchCategories={refetchCategory}
            />
          )}
        </>
      )}
      <StyledContainer>
        <Heading textStyle="title.large" asChild consumeCss>
          <h2>{t("myNdla.arena.posts.title")}</h2>
        </Heading>
        <ButtonContainer>
          {user?.isModerator && <SafeLinkButton to="edit">{t("myNdla.arena.admin.category.edit")}</SafeLinkButton>}
          <SafeLinkButton to="topic/new">{t("myNdla.arena.new.topic")}</SafeLinkButton>
        </ButtonContainer>
      </StyledContainer>
      <ListWrapper>
        {arenaCategory?.topics?.map((topic) => (
          <StyledCardContainer key={`topicContainer-${topic.id}`}>
            <TopicCard
              key={`topic-${topic.id}`}
              id={topic.id}
              title={topic.title}
              timestamp={topic.created}
              count={topic.postCount}
              locked={topic.isLocked}
            />
          </StyledCardContainer>
        ))}
      </ListWrapper>
    </MyNdlaPageWrapper>
  );
};

export default TopicPage;
