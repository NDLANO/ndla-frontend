/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AddLine } from "@ndla/icons";
import { Button, Heading } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { AlertDialog } from "./components/AlertDialog";
import LearningpathStepForm from "./components/LearningpathStepForm";
import { LearningpathStepListItem } from "./components/LearningpathStepListItem";
import { formValuesToGQLInput, toFormValues } from "./learningpathFormUtils";
import { useCreateLearningpathStep } from "./learningpathMutations";
import { FormValues } from "./types";
import { useToast } from "../../../components/ToastContext";
import { GQLMyNdlaLearningpathFragment } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";

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

interface Props {
  // TODO
  learningpath: GQLMyNdlaLearningpathFragment;
}

export const EditLearningpathStepsPageContent = ({ learningpath }: Props) => {
  const { t, i18n } = useTranslation();
  const [selectedLearningpathStepId, setSelectedLearningpathStepId] = useState<undefined | number>(undefined);
  const [nextId, setNextId] = useState<number | undefined>(undefined);

  const [createStep] = useCreateLearningpathStep();
  const toast = useToast();

  const formMethods = useForm<FormValues>({
    defaultValues: toFormValues("text"),
  });

  const onSaveStep = async (values: FormValues) => {
    if (learningpath?.id) {
      const transformedData = formValuesToGQLInput(values);
      const res = await createStep({
        variables: {
          learningpathId: learningpath.id,
          params: { ...transformedData, language: i18n.language, showTitle: false },
        },
      });
      if (!res.errors?.length) {
        handleStateChanges(undefined);
        toast.create({ title: t("myNdla.learningpath.toast.createdStep", { name: values.title }) });
      } else {
        toast.create({ title: t("myNdla.learningpath.toast.createdStepFailed", { name: values.title }) });
      }
    }
  };

  const onFormChange = (val: number | undefined) => {
    if (formMethods.formState.isDirty && val) {
      setNextId(val);
    } else {
      handleStateChanges(val);
    }
  };

  const handleStateChanges = (val: number | undefined) => {
    //Reset the form to remove traces of changes
    formMethods.reset();
    setSelectedLearningpathStepId(val);
    setNextId(undefined);
  };

  return (
    <FormProvider {...formMethods}>
      {nextId ? (
        <AlertDialog
          formState={formMethods.formState}
          isBlocking={!!nextId}
          onAbort={() => setNextId(undefined)}
          onContinue={() => handleStateChanges(nextId)}
        />
      ) : null}
      <Stack gap="medium" justify="left">
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t("myNdla.learningpath.form.content.title")}</h2>
        </Heading>
        <StyledOl>
          {learningpath.learningsteps?.map((step) => (
            <LearningpathStepListItem
              selectedLearningpathStepId={selectedLearningpathStepId}
              setSelectedLearningpathStepId={(val) => onFormChange(val)}
              learningpath={learningpath}
              step={step}
              key={step.id}
            />
          ))}
        </StyledOl>
        {!selectedLearningpathStepId || selectedLearningpathStepId !== -1 ? (
          <AddButton variant="secondary" onClick={() => onFormChange(-1)}>
            <AddLine />
            {t("myNdla.learningpath.form.steps.add")}
          </AddButton>
        ) : null}
        {selectedLearningpathStepId === -1 ? (
          <LearningpathStepForm stepType="text" onClose={() => onFormChange(undefined)} onSave={onSaveStep} />
        ) : null}
      </Stack>
      <Stack justify="space-between" direction="row">
        <SafeLinkButton variant="secondary" to={routes.myNdla.learningpathEditTitle(learningpath.id)}>
          {t("myNdla.learningpath.form.back")}
        </SafeLinkButton>
        <SafeLinkButton variant="secondary" to={routes.myNdla.learningpathPreview(learningpath.id)}>
          {t("myNdla.learningpath.form.next")}
        </SafeLinkButton>
      </Stack>
    </FormProvider>
  );
};

export default EditLearningpathStepsPageContent;
