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
import { Button, Heading, Spinner, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { FormValues, LearningpathStepForm } from "./components/LearningpathStepForm";
import { useCreateLearningpathStep } from "./learningpathMutations";
import { learningpathQuery, useFetchLearningpath } from "./learningpathQueries";
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
    width: "100%",
  },
});

export const EditLearningpathStepsPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { learningpathId } = useParams();
  const { user } = useContext(AuthContext);

  const { data, loading } = useFetchLearningpath({
    variables: { pathId: learningpathId ?? "-1" },
    skip: !learningpathId,
  });

  const [createStep] = useCreateLearningpathStep();

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.arenaNewCategoryPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  const onSaveStep = async (values: FormValues) => {
    if (data?.myNdlaLearningpath?.id) {
      const transformedData = formValuesToGQLInput(values);
      await createStep({
        variables: {
          learningpathId: data.myNdlaLearningpath.id,
          params: { ...transformedData, license: ALL_ABBREVIATIONS[4], language: i18n.language, showTitle: false },
        },
        refetchQueries: [{ query: learningpathQuery, variables: { pathId: data.myNdlaLearningpath.id } }],
      });
      setIsCreating(false);
    }
  };

  if (loading) {
    return <Spinner aria-label={t("loading")} />;
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
      <LearningpathStepper step="content" learningpathId={data.myNdlaLearningpath.id} />
      <Stack gap="medium" justify="left">
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t("myNdla.learningpath.form.content.title")}</h2>
        </Heading>
        <Text textStyle="body.large">{t("myNdla.learningpath.form.content.subTitle")}</Text>
        <StyledOl>
          {data.myNdlaLearningpath.learningsteps.map((step) => (
            <LearningpathStepListItem learningpathId={data.myNdlaLearningpath?.id ?? -1} step={step} key={step.id} />
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
            onSave={onSaveStep}
          />
        )}
      </Stack>
      <Stack justify="space-between" direction="row">
        <SafeLinkButton variant="secondary" to={routes.myNdla.learningpathEditTitle(data.myNdlaLearningpath.id)}>
          {t("myNdla.learningpath.form.back")}
        </SafeLinkButton>
        <SafeLinkButton to={routes.myNdla.learningpathPreview(data.myNdlaLearningpath.id)}>
          {t("myNdla.learningpath.form.next")}
        </SafeLinkButton>
      </Stack>
    </MyNdlaPageWrapper>
  );
};
