/**
 * Copyright (c) 2023-present, NDLA.
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
import { INewCategory } from "@ndla/types-backend/myndla-api";
import { Heading } from "@ndla/typography";
import ArenaCategoryForm from "./components/ArenaCategoryForm";
import { ArenaFormWrapper } from "./components/ArenaForm";
import { useArenaCategory } from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { PageSpinner } from "../../../components/PageSpinner";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import { useEditArenaCategory } from "../arenaMutations";
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

const CategoryEditPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { loading, arenaCategory } = useArenaCategory(categoryId);
  const updateCategory = useEditArenaCategory();
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
      const category = await updateCategory.editArenaCategory({
        variables: {
          categoryId: Number(categoryId),
          description: values.description ?? "",
          title: values.title ?? "",
          visible: values.visible ?? true,
          parentCategoryId: Number(values.parentCategoryId),
        },
      });

      if (category.data?.updateArenaCategory.id) {
        navigate(routes.myNdla.arenaCategory(category.data?.updateArenaCategory.id));
      }
    },
    [updateCategory, categoryId, navigate],
  );

  const onAbort = useCallback(() => {
    if (categoryId) navigate(routes.myNdla.arenaCategory(Number(categoryId)));
    else navigate(routes.myNdla.arena);
  }, [categoryId, navigate]);

  if (loading || !authContextLoaded) return <PageSpinner />;
  if (!categoryId) return <Navigate to={routes.myNdla.arena} />;
  if (user && !(user.isModerator || user.arenaEnabled))
    return <Navigate to={routes.myNdla.arenaCategory(Number(categoryId))} />;

  return (
    <MyNdlaPageWrapper>
      <PageWrapper>
        <BreadcrumbWrapper>
          <MyNdlaBreadcrumb
            breadcrumbs={[
              {
                name: arenaCategory?.title ?? "",
                id: `category/${categoryId}`,
              },
              {
                name: t("myNdla.arena.admin.category.form.editCategory"),
                id: "editCategory",
              },
            ]}
            page={"arena"}
          />
        </BreadcrumbWrapper>
        <HelmetWithTracker title={t("htmlTitles.arenaEditCategoryPage")} />
        <ArenaFormWrapper>
          <Heading element="h1" headingStyle="h1-resource" margin="none">
            {t("myNdla.arena.admin.category.form.editCategory")}
          </Heading>
          <ArenaCategoryForm
            onAbort={onAbort}
            onSave={onSave}
            initialTitle={arenaCategory?.title}
            initialDescription={arenaCategory?.description}
            initialVisible={arenaCategory?.visible}
            initialParentCategoryId={arenaCategory?.parentCategoryId}
          />
        </ArenaFormWrapper>
      </PageWrapper>
    </MyNdlaPageWrapper>
  );
};

export default CategoryEditPage;
