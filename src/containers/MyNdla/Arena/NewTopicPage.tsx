/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import ArenaForm, { ArenaFormValues, ArenaFormWrapper } from "./components/ArenaForm";
import { useArenaCategory, useArenaCreateTopic } from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.large};
`;

export const NewTopicPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { trackPageView } = useTracker();
  const navigate = useNavigate();
  const arenaTopicMutation = useArenaCreateTopic(categoryId);
  const { loading, arenaCategory } = useArenaCategory(categoryId);
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || !loading) return;
    trackPageView({
      title: t("htmlTitles.arenaNewTopicPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaCategory?.title, authContextLoaded, loading, t, trackPageView, user]);

  const onSave = useCallback(
    async (values: Partial<ArenaFormValues>) => {
      const topic = await arenaTopicMutation.createArenaTopic({
        variables: {
          content: values.content ?? "",
          title: values.title ?? "",
          categoryId: Number(categoryId),
          isLocked: values.locked ?? false,
        },
      });
      const data = topic?.data;

      if (data && "newArenaTopicV2" in data && data.newArenaTopicV2?.id) {
        navigate(routes.myNdla.arenaTopic(data.newArenaTopicV2?.id));
      }

      if (data && "newArenaTopic" in data && data.newArenaTopic?.id) {
        navigate(routes.myNdla.arenaTopic(data.newArenaTopic?.id));
      }
    },
    [arenaTopicMutation, categoryId, navigate],
  );

  const onAbort = useCallback(() => {
    navigate(categoryId ? routes.myNdla.arenaCategory(Number(categoryId)) : routes.myNdla.arena);
  }, [categoryId, navigate]);

  if (authContextLoaded && (!authenticated || !user?.arenaEnabled)) return <Navigate to={routes.myNdla.arena} />;
  return (
    <MyNdlaPageWrapper>
      <PageWrapper>
        <BreadcrumbWrapper>
          <MyNdlaBreadcrumb
            breadcrumbs={
              categoryId
                ? [
                    {
                      name: arenaCategory?.title ?? "",
                      id: `category/${categoryId}`,
                    },
                    { name: t("myNdla.arena.new.topic"), id: "newTopic" },
                  ]
                : []
            }
            page={"arena"}
          />
        </BreadcrumbWrapper>
        <HelmetWithTracker title={t("htmlTitles.arenaNewTopicPage")} />
        <ArenaFormWrapper>
          <Heading element="h1" headingStyle="h1-resource" margin="none">
            {t("myNdla.arena.new.topic")}
          </Heading>
          <ArenaForm onAbort={onAbort} type="topic" onSave={onSave} />
        </ArenaFormWrapper>
      </PageWrapper>
    </MyNdlaPageWrapper>
  );
};
