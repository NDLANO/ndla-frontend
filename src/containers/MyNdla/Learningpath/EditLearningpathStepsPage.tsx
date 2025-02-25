/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { AddLine } from "@ndla/icons";
import { Button, Heading, Spinner } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { useCreateLearningpathStep, useDeleteLearningpathStep } from "./learningpathMutations";
import { useFetchLearningpath } from "./learningpathQueries";
import { formValuesToGQLInput, learningpathStepListItemId } from "./utils";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import { LearningpathStepListItem } from "./components/LearningpathStepListItem";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { FormValues } from "./types";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const LearningpathStepForm = lazy(() => import("./components/LearningpathStepForm"));

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
  const [deleteStep] = useDeleteLearningpathStep(learningpathId ?? "");

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.learningpathEditStepsPage", { name: data?.myNdlaLearningpath?.title }),
      dimensions: getAllDimensions({ user }),
    });
  }, [data?.myNdlaLearningpath?.title, t, trackPageView, user]);

  const onSaveStep = async (values: FormValues) => {
    if (data?.myNdlaLearningpath?.id) {
      const transformedData = formValuesToGQLInput(values);
      const res = await createStep({
        variables: {
          learningpathId: data.myNdlaLearningpath.id,
          params: { ...transformedData, language: i18n.language, showTitle: false },
        },
      });
      if (!res.errors?.length) {
        setIsCreating(false);
        setTimeout(
          () =>
            document
              .getElementById(learningpathStepListItemId(res.data?.newLearningpathStep.id ?? 0))
              ?.querySelector("button")
              ?.focus(),
          0,
        );
      }
    }
  };

  const onDeleteStep = async (stepId: number, close: VoidFunction) => {
    if (data?.myNdlaLearningpath?.id) {
      const el = document.getElementById(learningpathStepListItemId(stepId));
      const focusEl = [el?.nextElementSibling, el?.previousElementSibling]
        .find((el) => el?.tagName === "LI")
        ?.querySelector("button");

      const res = await deleteStep({
        variables: {
          learningstepId: stepId,
          learningpathId: data.myNdlaLearningpath.id,
        },
      });

      if (!res.errors?.length) {
        close();
        setTimeout(() => (focusEl ?? document.getElementById(SKIP_TO_CONTENT_ID))?.focus(), 0);
      }
    }
  };

  const onOpenCreate = async () => {
    setIsCreating(true);
    setTimeout(() => document.getElementById("create-step-form")?.querySelector("input")?.focus(), 500);
  };

  const onCloseCreate = async () => {
    setIsCreating(false);
    setTimeout(() => document.getElementById("create-step")?.focus(), 0);
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
            <LearningpathStepListItem
              learningpathId={data.myNdlaLearningpath?.id ?? -1}
              id={learningpathStepListItemId(step.id)}
              onDelete={onDeleteStep}
              step={step}
              key={step.id}
            />
          ))}
        </StyledOl>
        {!isCreating ? (
          <AddButton variant="secondary" onClick={onOpenCreate} id="create-step">
            <AddLine />
            {t("myNdla.learningpath.form.steps.add")}
          </AddButton>
        ) : (
          <Suspense fallback={<Spinner />}>
            <LearningpathStepForm stepType="text" onClose={onCloseCreate} onSave={onSaveStep} id="create-step-form" />
          </Suspense>
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
