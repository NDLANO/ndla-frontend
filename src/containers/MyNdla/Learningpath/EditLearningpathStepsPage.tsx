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
import { Button, Heading, Spinner } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { LearningpathStepForm } from "./components/LearningpathStepForm";
import { useCreateLearningpathStep } from "./learningpathMutations";
import { useFetchLearningpath } from "./learningpathQueries";
import { formValuesToGQLInput } from "./utils";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import { LearningpathStepListItem } from "./components/LearningpathStepListItem";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { FormValues } from "./types";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

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

  const [createStep] = useCreateLearningpathStep(learningpathId ?? "");

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.learningpathEditStepsPage", { name: data?.myNdlaLearningpath?.title }),
      dimensions: getAllDimensions({ user }),
    });
  }, [data?.myNdlaLearningpath?.title, t, trackPageView, user]);

  const onSaveStep = async (values: FormValues) => {
    if (data?.myNdlaLearningpath?.id) {
      const transformedData = formValuesToGQLInput(values);
      await createStep({
        variables: {
          learningpathId: data.myNdlaLearningpath.id,
          params: { ...transformedData, language: i18n.language, showTitle: false },
        },
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
      <Stack gap="medium" justify="left">
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t("myNdla.learningpath.form.content.title")}</h2>
        </Heading>
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
          <LearningpathStepForm stepType="text" onClose={() => setIsCreating(false)} onSave={onSaveStep} />
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
