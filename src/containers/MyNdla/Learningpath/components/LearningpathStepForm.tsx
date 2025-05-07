/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useEffect } from "react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  FieldErrorMessage,
  FieldLabel,
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { AlertDialog } from "./AlertDialog";
import { ExternalStepForm } from "./ExternalStepForm";
import { FolderStepForm } from "./FolderStepForm";
import { LearningpathStepDeleteDialog } from "./LearningpathStepDeleteDialog";
import { ResourceStepForm } from "./ResourceStepForm";
import { TextStepForm } from "./TextStepForm";
import { useToast } from "../../../../components/ToastContext";
import { SKIP_TO_CONTENT_ID } from "../../../../constants";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import {
  useCreateLearningpathStep,
  useDeleteLearningpathStep,
  useUpdateLearningpathStep,
} from "../../../../mutations/learningpathMutations";
import { routes } from "../../../../routeHelpers";
import { formValuesToGQLInput, toFormValues } from "../learningpathFormUtils";
import { useLearningpathStep } from "../LearningpathOutlet";
import { FormValues } from "../types";
import { getFormTypeFromStep, learningpathStepEditButtonId } from "../utils";

const ContentForm = styled("form", {
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    border: "1px solid",
    borderColor: "stroke.discrete",
    background: "surface.subtle",
  },
});

const RADIO_GROUP_OPTIONS = ["text", "resource", "external", "folder"] as const;

export const LearningpathStepForm = () => {
  const context = useLearningpathStep();
  const stepType = getFormTypeFromStep(context?.step);
  const { learningpathId: learningpathIdParam, stepId: stepIdParam } = useParams();
  const { t, i18n } = useTranslation();

  const toast = useToast();
  const navigate = useNavigate();
  const [updateStep] = useUpdateLearningpathStep();
  const [deleteStep] = useDeleteLearningpathStep();
  const [createStep] = useCreateLearningpathStep();

  const methods = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: toFormValues(stepType, context?.step),
  });

  const learningpathId = learningpathIdParam ? Number(learningpathIdParam) : undefined;

  useEffect(() => {
    if (stepIdParam === "new") setTimeout(() => document.querySelector("form")?.querySelector("input")?.focus(), 0);
  }, [stepIdParam]);

  if (!learningpathId || !stepIdParam) return null;

  const onSave = async (values: FormValues) => {
    if (!learningpathId || !stepIdParam) return;
    const transformedData = formValuesToGQLInput(values);

    if (stepIdParam === "new") {
      const res = await createStep({
        variables: {
          learningpathId: learningpathId,
          params: { ...transformedData, language: i18n.language, showTitle: false },
        },
      });

      if (!res.errors?.length) {
        toast.create({ title: t("myNdla.learningpath.toast.createdStep", { name: values.title }) });
        navigate(routes.myNdla.learningpathEditSteps(learningpathId), {
          state: {
            focusStepId: res.data?.newLearningpathStep.id
              ? learningpathStepEditButtonId(res.data?.newLearningpathStep.id)
              : undefined,
          },
        });
      } else {
        toast.create({ title: t("myNdla.learningpath.toast.createdStepFailed", { name: values.title }) });
      }
    } else {
      const stepId = Number(stepIdParam);
      if (!stepId) return;

      const res = await updateStep({
        variables: {
          learningpathId: learningpathId,
          learningstepId: Number(stepIdParam),
          params: { ...transformedData, language: i18n.language, revision: context.step.revision },
        },
      });
      if (!res.errors?.length) {
        const stepId = Number(stepIdParam);
        navigate(routes.myNdla.learningpathEditSteps(learningpathId), {
          state: {
            focusStepId: Object.is(NaN, stepId) ? undefined : learningpathStepEditButtonId(stepId),
          },
        });
      } else {
        toast.create({ title: t("myNdla.learningpath.toast.updateStepFailed", { name: values.title }) });
      }
    }
  };

  const { handleSubmit, control, reset, formState } = methods;

  const onDelete = async (closeDialog: VoidFunction) => {
    const stepId = Number(stepIdParam);

    const res = await deleteStep({
      variables: {
        learningstepId: stepId,
        learningpathId: learningpathId,
      },
    });

    if (!res.errors?.length) {
      closeDialog();
      reset();
      toast.create({ title: t("myNdla.learningpath.toast.deletedStep", { name: context?.step.title }) });
      const el = document.getElementById(stepId.toString());
      const focusEl = [el?.nextElementSibling, el?.previousElementSibling]
        .find((el) => el?.tagName === "LI")
        ?.querySelector("div")
        ?.querySelector("a");
      navigate(routes.myNdla.learningpathEditSteps(learningpathId), {
        state: { focusStepId: focusEl?.id ?? SKIP_TO_CONTENT_ID },
        replace: true,
      });
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.deletedStepFailed", { name: context?.step.title }) });
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSave)();
  };

  return (
    <FormProvider {...methods}>
      <ContentForm onSubmit={onSubmit} noValidate>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <FieldRoot required>
              <FieldLabel>{t("myNdla.learningpath.form.content.title")}</FieldLabel>
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
              <RadioGroupRoot
                onValueChange={(details) => {
                  reset(toFormValues(details.value as FormValues["type"]));
                  field.onChange(details.value);
                }}
                value={field.value}
                ref={field.ref}
                disabled={field.disabled}
                name={field.name}
                onBlur={field.onBlur}
                orientation="vertical"
              >
                {RADIO_GROUP_OPTIONS.map((val) => (
                  <RadioGroupItem value={val} key={val}>
                    <RadioGroupItemControl />
                    <RadioGroupItemText>{t(`myNdla.learningpath.form.options.${val}`)}</RadioGroupItemText>
                    <RadioGroupItemHiddenInput />
                  </RadioGroupItem>
                ))}
              </RadioGroupRoot>
            </FieldRoot>
          )}
        />
        <StepFormType step={context?.step} />
        <HStack justify={context?.step ? "space-between" : "end"}>
          {context?.step ? <LearningpathStepDeleteDialog onDelete={onDelete} /> : null}
          <HStack>
            <SafeLinkButton
              to={routes.myNdla.learningpathEditSteps(learningpathId)}
              state={{
                focusStepId: Object.is(NaN, Number(stepIdParam))
                  ? undefined
                  : learningpathStepEditButtonId(Number(stepIdParam)),
              }}
              variant="secondary"
            >
              {t("cancel")}
            </SafeLinkButton>
            <Button type="submit" disabled={!formState.isDirty || formState.isSubmitting}>
              {t("save")}
            </Button>
          </HStack>
        </HStack>
      </ContentForm>
      <AlertDialog />
    </FormProvider>
  );
};

interface StepFormTypeProps {
  step: GQLMyNdlaLearningpathStepFragment | undefined;
}

const StepFormType = ({ step }: StepFormTypeProps) => {
  const { watch } = useFormContext<FormValues>();
  const formType = watch("type");

  if (formType === "resource") {
    return (
      <ResourceStepForm
        resource={
          step?.resource
            ? {
                resourceTypes: step.resource.resourceTypes,
                title: step.title,
                breadcrumbs: step.resource.breadcrumbs,
                url: step.embedUrl?.url ?? "",
              }
            : undefined
        }
      />
    );
  } else if (formType === "external") {
    return <ExternalStepForm />;
  } else if (formType === "text") {
    return <TextStepForm />;
  } else if (formType === "folder") {
    return <FolderStepForm />;
  }
  return null;
};

export default LearningpathStepForm;
