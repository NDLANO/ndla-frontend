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
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { ModeratorButtonWrapper } from "./ArenaPage";
import { PostActions, PostButtons } from "./ArenaToolbar";
import { TopicListItem } from "./components/ArenaListItem";
import SortableArenaCards from "./components/SortableArenaCards";
import { useArenaCategory } from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledMyNdlaPageWrapper = styled(MyNdlaPageWrapper, {
  base: {
    gap: "xxlarge",
  },
});

const ListWrapper = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const StyledContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

const Introduction = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledHeading = styled(Heading, {
  base: {
    marginBlockStart: "xsmall",
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const ButtonContainer = styled("div", {
  base: {
    marginInlineStart: "auto",
    display: "flex",
    flexDirection: "row",
    gap: "3xsmall",
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
    <StyledMyNdlaPageWrapper buttons={<PostButtons />} dropDownMenu={<PostActions />}>
      <HelmetWithTracker title={t("htmlTitles.arenaTopicPage", { name: arenaCategory?.title })} />
      <Introduction>
        <MyNdlaBreadcrumb breadcrumbs={crumbs} page={"arena"} />
        <StyledHeading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
          {arenaCategory?.title}
          {user?.isModerator && !arenaCategory?.visible && (
            <EyeFill
              title={t("myNdla.arena.admin.category.notVisible")}
              aria-label={t("myNdla.arena.admin.category.notVisible")}
              aria-hidden={false}
            />
          )}
        </StyledHeading>
        {!!arenaCategory?.description && <Text textStyle="body.xlarge">{arenaCategory.description}</Text>}
      </Introduction>
      {showCategories && (
        <StyledContainer>
          <HeadingWrapper>
            <Heading textStyle="heading.small" asChild consumeCss>
              <h2>{t("myNdla.arena.category.subcategory")}</h2>
            </Heading>
            {user?.isModerator && (
              <ModeratorButtonWrapper>
                <Button onClick={() => setIsEditing((prev) => !prev)}>
                  {isEditing
                    ? t("myNdla.arena.admin.category.stopEditing")
                    : t("myNdla.arena.admin.category.startEditing")}
                </Button>
                <SafeLinkButton to={`/minndla/arena/category/new?parent-id=${arenaCategory.id}`}>
                  {t("myNdla.arena.admin.category.form.newCategory")}
                </SafeLinkButton>
              </ModeratorButtonWrapper>
            )}
          </HeadingWrapper>
          {arenaCategory.subcategories && (
            <SortableArenaCards
              isEditing={isEditing}
              categories={arenaCategory?.subcategories ?? []}
              user={user}
              categoryParentId={arenaCategory.id}
              refetchCategories={refetchCategory}
            />
          )}
          <Text textStyle="label.medium">
            {t("myNdla.arena.bottomText")}
            <SafeLink to={`mailto:${t("myNdla.arena.moderatorEmail")}`}>{t("myNdla.arena.moderatorEmail")}</SafeLink>
          </Text>
        </StyledContainer>
      )}
      <StyledContainer>
        <HeadingWrapper>
          <Heading textStyle="heading.small" asChild consumeCss>
            <h2>{t("myNdla.arena.posts.title")}</h2>
          </Heading>
          <ButtonContainer>
            {user?.isModerator && <SafeLinkButton to="edit">{t("myNdla.arena.admin.category.edit")}</SafeLinkButton>}
            <SafeLinkButton to="topic/new">{t("myNdla.arena.new.topic")}</SafeLinkButton>
          </ButtonContainer>
        </HeadingWrapper>
        <ListWrapper>
          {arenaCategory?.topics?.map((topic) => (
            <li key={`topicContainer-${topic.id}`}>
              <TopicListItem
                variant="list"
                key={`topic-${topic.id}`}
                id={topic.id}
                title={topic.title}
                timestamp={topic.created}
                postCount={topic.postCount}
                voteCount={topic.voteCount}
                category={arenaCategory.title}
                locked={topic.isLocked}
              />
            </li>
          ))}
        </ListWrapper>
      </StyledContainer>
    </StyledMyNdlaPageWrapper>
  );
};

export default TopicPage;
