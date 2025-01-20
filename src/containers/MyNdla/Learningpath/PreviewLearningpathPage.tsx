/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Heading, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import { LearningpathFormButtonContainer } from "./LearningpathFormButtonContainer";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DefaultErrorMessagePage } from "../../../components/DefaultErrorMessage";
import Learningpath from "../../../components/Learningpath";
import { PageSpinner } from "../../../components/PageSpinner";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { NotFoundPage } from "../../NotFoundPage/NotFoundPage";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { GQLPreviewLearningpathQuery, GQLPreviewLearningpathQueryVariables } from "../../../graphqlTypes";
import { getAllDimensions } from "../../../util/trackingUtil";

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

export const previewLearningpathQuery = gql`
  query previewLearningpath($pathId: String!, $transformArgs: TransformedArticleContentInput) {
    learningpath(pathId: $pathId) {
      id
      ...Learningpath_Learningpath
      learningsteps {
        ...Learningpath_LearningpathStep
      }
    }
  }
  ${Learningpath.fragments.learningpath}
  ${Learningpath.fragments.learningpathStep}
`;

export const PreviewLearningpathPage = () => {
  const { t } = useTranslation();
  const { learningpathId, stepId } = useParams();
  const { user } = useContext(AuthContext);
  const { trackPageView } = useTracker();

  const learningpathQuery = useQuery<GQLPreviewLearningpathQuery, GQLPreviewLearningpathQueryVariables>(
    previewLearningpathQuery,
    {
      variables: { pathId: learningpathId ?? "" },
      skip: !learningpathId,
      fetchPolicy: "cache-and-network",
    },
  );

  useEffect(() => {
    if (!learningpathQuery.data?.learningpath?.title) return;
    trackPageView({
      title: t("htmlTitles.learningpathSavePage", { name: learningpathQuery.data.learningpath.title }),
      dimensions: getAllDimensions({ user }),
    });
  }, [learningpathQuery.data?.learningpath?.title, t, trackPageView, user]);

  if (learningpathQuery.loading) {
    return <PageSpinner />;
  }

  if (!learningpathQuery.data?.learningpath || (stepId && isNaN(Number(stepId)))) {
    return <DefaultErrorMessagePage />;
  }

  const learningpath = learningpathQuery.data.learningpath;
  const numericStepId = stepId ? Number(stepId) : undefined;

  // If stepId is provided, find it. If not, fall back to the first step.
  const learningpathStep = numericStepId
    ? learningpath.learningsteps.find((step) => step.id === numericStepId)
    : learningpath.learningsteps[0];

  // stepId is defined, but not found within the learningpath
  if (numericStepId && numericStepId > 0 && !learningpathStep) {
    return <NotFoundPage />;
  }

  return (
    <MyNdlaPageWrapper>
      <title>{t("htmlTitles.learningpathPreviewPage", { name: learningpath.title })}</title>
      <MyNdlaBreadcrumb
        breadcrumbs={[
          { id: `preview-${learningpath.id}`, name: t("myNdla.learningpath.previewLearningpath.pageHeading") },
        ]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {learningpath.title}
      </Heading>
      <LearningpathStepper step="preview" learningpathId={learningpath.id} />
      <TextWrapper>
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t("myNdla.learningpath.previewLearningpath.pageHeading")}</h2>
        </Heading>
        <Text>{t("myNdla.learningpath.previewLearningpath.pageDescription")}</Text>
      </TextWrapper>
      {learningpathStep ? (
        <Learningpath
          // TODO: We should probably pass down `skipToContentId` here. Let's fix it when we fix the remaining learningpath previews
          learningpath={learningpath}
          learningpathStep={learningpathStep}
          breadcrumbItems={[]}
          context="preview"
        />
      ) : (
        <Text>{t("myNdla.learningpath.previewLearningpath.noSteps")}</Text>
      )}
      <LearningpathFormButtonContainer>
        <SafeLinkButton variant="secondary" to={routes.myNdla.learningpathEditSteps(learningpath.id)}>
          {t("myNdla.learningpath.form.back")}
        </SafeLinkButton>
        <SafeLinkButton to={routes.myNdla.learningpathSave(learningpath.id)}>
          {t("myNdla.learningpath.form.next")}
        </SafeLinkButton>
      </LearningpathFormButtonContainer>
    </MyNdlaPageWrapper>
  );
};
