/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { Heading, Spinner } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { useFetchLearningpath } from "./learningpathQueries";
import { AuthContext } from "../../../components/AuthenticationContext";
import MyNdlaBreadcrumb from "../../../components/MyNdla/MyNdlaBreadcrumb";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const EditLearningpathStepsPageContent = lazy(() => import("./EditLearningpathStepsPageContent"));

export const EditLearningpathStepsPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { learningpathId } = useParams();
  const { user } = useContext(AuthContext);

  const { data, loading } = useFetchLearningpath({
    variables: { pathId: learningpathId ?? "-1" },
    skip: !learningpathId,
  });

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.learningpathEditStepsPage", { name: data?.myNdlaLearningpath?.title }),
      dimensions: getAllDimensions({ user }),
    });
  }, [data?.myNdlaLearningpath?.title, t, trackPageView, user]);

  if (loading) {
    return <Spinner aria-label={t("loading")} />;
  }

  if (!data?.myNdlaLearningpath) {
    return <Navigate to={routes.myNdla.learningpath} />;
  }

  return (
    <MyNdlaPageWrapper type="learningpath">
      <HelmetWithTracker title={t("htmlTitles.learningpathEditStepsPage", { name: data?.myNdlaLearningpath?.title })} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: `${t("myNdla.learningpath.editLearningpath")}` }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {data.myNdlaLearningpath.title}
      </Heading>
      <LearningpathStepper step="content" learningpathId={data.myNdlaLearningpath.id} />
      <Suspense fallback={<Spinner aria-label={t("loading")} />}>
        <EditLearningpathStepsPageContent learningpath={data.myNdlaLearningpath} />
      </Suspense>
    </MyNdlaPageWrapper>
  );
};
