/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { Heading, Spinner } from "@ndla/primitives";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { EditLearningpathStepsPageContent } from "./EditLearningpathStepsPageContent";
import { useFetchLearningpath } from "./learningpathQueries";
import { MyNdlaBreadcrumb } from "../../../components/MyNdla/MyNdlaBreadcrumb";
import { PageTitle } from "../../../components/PageTitle";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { NotFoundPage } from "../../NotFoundPage/NotFoundPage";
import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";

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
    <MyNdlaPageWrapper type="learningpath">
      <PageTitle title={t("htmlTitles.learningpathEditStepsPage", { name: data.myNdlaLearningpath.title })} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: `${t("myNdla.learningpath.editLearningpath")}` }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {data.myNdlaLearningpath.title}
      </Heading>
      <LearningpathStepper step="content" learningpathId={data.myNdlaLearningpath.id} />
      <EditLearningpathStepsPageContent learningpath={data.myNdlaLearningpath} />
    </MyNdlaPageWrapper>
  );
};
