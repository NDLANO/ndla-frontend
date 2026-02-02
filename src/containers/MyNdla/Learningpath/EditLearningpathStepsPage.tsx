/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { MyNdlaBreadcrumb } from "../../../components/MyNdla/MyNdlaBreadcrumb";
import { MyNdlaTitle } from "../../../components/MyNdla/MyNdlaTitle";
import { PageTitle } from "../../../components/PageTitle";
import { routes } from "../../../routeHelpers";
import { NotFoundPage } from "../../NotFoundPage/NotFoundPage";
import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { MyNdlaPageContent } from "../components/MyNdlaPageSection";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { EditLearningpathStepsPageContent } from "./EditLearningpathStepsPageContent";
import { useFetchLearningpath } from "./learningpathQueries";

export const Component = () => {
  return <PrivateRoute element={<EditLearningpathStepsPage />} />;
};

export const EditLearningpathStepsPage = () => {
  const { t } = useTranslation();
  const { learningpathId } = useParams();

  const { data, loading } = useFetchLearningpath({
    variables: { pathId: learningpathId ?? "-1" },
    skip: !learningpathId,
  });

  if (loading) {
    return <Spinner aria-label={t("loading")} />;
  }

  if (!data?.myNdlaLearningpath) {
    return <Navigate to={routes.myNdla.learningpath} />;
  }

  if (!data.myNdlaLearningpath.canEdit) {
    return <NotFoundPage />;
  }

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={t("htmlTitles.learningpathEditStepsPage", { name: data.myNdlaLearningpath.title })} />
      <MyNdlaPageContent>
        <MyNdlaBreadcrumb
          breadcrumbs={[{ id: "0", name: t("myNdla.learningpath.editLearningpath") }]}
          page="learningpath"
        />
        <MyNdlaTitle title={data.myNdlaLearningpath.title} />
        <LearningpathStepper step="content" learningpathId={data.myNdlaLearningpath.id} />
      </MyNdlaPageContent>
      <MyNdlaPageContent>
        <EditLearningpathStepsPageContent learningpath={data.myNdlaLearningpath} />
      </MyNdlaPageContent>
    </MyNdlaPageWrapper>
  );
};
