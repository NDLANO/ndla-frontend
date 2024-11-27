/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Heading, Spinner } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { LearningpathStepForm } from "./components/LearningpathStepForm";
import { LearningPathStepper } from "./components/LearningPathStepper";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { useFetchLearningpath } from "../learningpathQueries";

export const ContentLearningpathPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { learningpathId } = useParams();
  const { user } = useContext(AuthContext);

  const { learningpath, loading } = useFetchLearningpath({
    variables: { pathId: learningpathId! },
    skip: !learningpathId,
  });

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.arenaNewCategoryPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: `${t("myNdla.learningpath.newLearningpath")}` }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {learningpath?.title}
      </Heading>
      <LearningPathStepper stepKey="content" />
      <LearningpathStepForm />
    </MyNdlaPageWrapper>
  );
};
