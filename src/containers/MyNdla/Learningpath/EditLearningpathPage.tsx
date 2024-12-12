/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { AddLine } from "@ndla/icons";
import { ALL_ABBREVIATIONS } from "@ndla/licenses";
import { Button, Heading, Spinner } from "@ndla/primitives";
import { styled, VStack } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { FormValues, LearningpathStepForm } from "./components/LearningpathStepForm";
import { useCreateLearningpathStep } from "./learningpathMutations";
import { useFetchLearningpath } from "./learningpathQueries";
import { formValuesToGQLInput } from "./utils";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { LearningpathStepListItem } from "./components/LearningpathStepListItem";
import { LearningpathStepper } from "./components/LearningpathStepper";

const StyledOl = styled("ol", {
  base: {
    listStyle: "none",
    width: "100%",
  },
});

const AddButton = styled(Button, {
  base: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: "small",
  },
});

export const EditLearningpathPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { learningpathId } = useParams();
  const { user } = useContext(AuthContext);

  const { data, loading } = useFetchLearningpath({
    variables: { pathId: learningpathId! },
    skip: !learningpathId,
  });

  const [createStep] = useCreateLearningpathStep();

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.arenaNewCategoryPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  const onSave = async (values: FormValues) => {
    if (data?.myNdlaLearningpath?.id) {
      const transformedData = formValuesToGQLInput(values);
      await createStep({
        variables: {
          learningpathId: data.myNdlaLearningpath.id,
          params: { ...transformedData, license: ALL_ABBREVIATIONS[4], language: i18n.language, showTitle: false },
        },
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!data?.myNdlaLearningpath) {
    return <Navigate to={routes.myNdla.learningpath} />;
  }

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: `${t("myNdla.learningpath.newLearningpath")}` }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {data.myNdlaLearningpath.title}
      </Heading>
      <LearningpathStepper step="content" />
      <VStack gap="medium">
        <StyledOl>
          {data.myNdlaLearningpath.learningsteps.map((step) => (
            // TODO: Remove this when typescript is
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            <LearningpathStepListItem learningpathId={data.myNdlaLearningpath?.id!} step={step} key={step.id} />
          ))}
        </StyledOl>
        {!isCreating ? (
          <AddButton variant="secondary" onClick={() => setIsCreating(true)}>
            <AddLine />
            {t("myNdla.learningpath.form.steps.add")}
          </AddButton>
        ) : (
          <LearningpathStepForm
            learningpathId={data.myNdlaLearningpath.id}
            onClose={() => setIsCreating(false)}
            onSave={onSave}
          />
        )}
      </VStack>
    </MyNdlaPageWrapper>
  );
};
