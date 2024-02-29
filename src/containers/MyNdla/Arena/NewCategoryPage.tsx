/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { INewCategory } from "@ndla/types-backend/myndla-api";
import { Heading } from "@ndla/typography";
import ArenaCategoryForm from "./components/ArenaCategoryForm";
import { ArenaFormWrapper } from "./components/ArenaForm";
import { AuthContext } from "../../../components/AuthenticationContext";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import { useCreateArenaCategory } from "../arenaMutations";
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

export const NewCategoryPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const navigate = useNavigate();
  const newCategoryMutation = useCreateArenaCategory();
  const { user, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || !user?.isModerator) return;
    trackPageView({
      title: t("htmlTitles.arenaNewCategoryPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  const onSave = useCallback(
    async (values: Partial<INewCategory>) => {
      const category = await newCategoryMutation.createArenaCategory({
        variables: {
          description: values.description ?? "",
          title: values.title ?? "",
          visible: values.visible ?? true,
        },
      });

      if (category.data?.newArenaCategory.id) {
        navigate(routes.myNdla.arenaCategory(category.data?.newArenaCategory.id));
      }
    },
    [newCategoryMutation, navigate],
  );

  const onAbort = useCallback(() => navigate(routes.myNdla.arena), [navigate]);

  return (
    <MyNdlaPageWrapper>
      <PageWrapper>
        <BreadcrumbWrapper>
          <MyNdlaBreadcrumb
            breadcrumbs={[
              {
                name: t("myNdla.arena.admin.category.form.newCategory"),
                id: "newCategory",
              },
            ]}
            page={"arena"}
          />
        </BreadcrumbWrapper>
        <HelmetWithTracker title={t("htmlTitles.arenaNewCategoryPage")} />
        <ArenaFormWrapper>
          <Heading element="h1" headingStyle="h1-resource" margin="none">
            {t("myNdla.arena.admin.category.form.newCategory")}
          </Heading>
          <ArenaCategoryForm onAbort={onAbort} onSave={onSave} />
        </ArenaFormWrapper>
      </PageWrapper>
    </MyNdlaPageWrapper>
  );
};

export default NewCategoryPage;
