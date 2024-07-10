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
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Eye } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { Heading, Text } from "@ndla/typography";
import { ModeratorButtonWrapper } from "./ArenaPage";
import { PostActions, PostButtons } from "./ArenaToolbar";
import SortableArenaCards from "./components/SortableArenaCards";
import { useArenaCategory } from "./components/temporaryNodebbHooks";
import TopicCard from "./components/TopicCard";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const ListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin: 0;
  padding: 0;
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${spacing.large} 0 ${spacing.normal};
`;

const StyledCardContainer = styled.li`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledEye = styled(Eye)`
  width: ${spacing.normal};
  height: ${spacing.normal};
  margin-left: ${spacing.small};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.xsmall};
`;

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

  if (loading || !authContextLoaded) return <Spinner />;
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
        <Heading element="h1" id={SKIP_TO_CONTENT_ID} headingStyle="h1-resource" margin="small">
          {arenaCategory?.title}
          {user?.isModerator && !arenaCategory?.visible && (
            <StyledEye
              title={t("myNdla.arena.admin.category.notVisible")}
              aria-label={t("myNdla.arena.admin.category.notVisible")}
              aria-hidden={false}
            />
          )}
        </Heading>
      </HeaderWrapper>
      <Text element="p" textStyle="content-alt" margin="none">
        {arenaCategory?.description}
      </Text>
      {showCategories && (
        <>
          <StyledContainer>
            <Heading element="h2" headingStyle="h2" margin="none">
              {t("myNdla.arena.category.subcategory")}
            </Heading>
            {user?.isModerator && (
              <ModeratorButtonWrapper>
                <Button size="small" onClick={() => setIsEditing((prev) => !prev)}>
                  {isEditing
                    ? t("myNdla.arena.admin.category.stopEditing")
                    : t("myNdla.arena.admin.category.startEditing")}
                </Button>
                {/* TODO: Update when SafeLinkButton using new button component is implemented */}
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
        <Heading element="h2" headingStyle="h2" margin="none">
          {t("myNdla.arena.posts.title")}
        </Heading>
        <ButtonContainer>
          {/* TODO: Update when SafeLinkButton using new button component is implemented */}
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
