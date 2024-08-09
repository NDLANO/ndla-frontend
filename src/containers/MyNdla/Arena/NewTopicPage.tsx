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
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import ArenaForm, { ArenaFormValues, ArenaFormWrapper } from "./components/ArenaForm";
import { useArenaCategory, useArenaCreateTopic } from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const PageWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
    paddingBlock: "medium",
  },
});

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

  if (!authContextLoaded || loading) return <PageSpinner />;
  if (!authenticated || (user && !user.arenaEnabled)) return <Navigate to={routes.myNdla.arena} />;

  const parentCrumbs =
    arenaCategory?.breadcrumbs?.map((crumb) => ({ name: crumb.title, id: `category/${crumb.id}` })) ?? [];
  const crumbs = [...parentCrumbs, { name: t("myNdla.arena.new.topic"), id: "newTopic" }];

  return (
    <MyNdlaPageWrapper>
      <PageWrapper>
        <MyNdlaBreadcrumb breadcrumbs={crumbs} page={"arena"} />
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
