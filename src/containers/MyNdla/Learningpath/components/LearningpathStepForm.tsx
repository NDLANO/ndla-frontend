/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useEffect, useRef, useState } from "react";
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
import { GQLMyNdlaLearningpathFragment, GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import {
  useCreateLearningpathStep,
  useDeleteLearningpathStep,
  useUpdateLearningpathStep,
} from "../../../../mutations/learningpathMutations";
import { routes } from "../../../../routeHelpers";
import { formValuesToGQLInput, toFormValues } from "../learningpathFormUtils";
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

interface Props {
  step?: GQLMyNdlaLearningpathStepFragment;
  learningPath: GQLMyNdlaLearningpathFragment;
}

export const LearningpathStepForm = ({ step, learningPath }: Props) => {
  const [focusStepId, setFocusStepId] = useState<string | undefined>(undefined);
  const wrapperRef = useRef<HTMLFormElement>(null);
  const { learningpathId: learningpathIdParam } = useParams();
  const { t } = useTranslation();

  const toast = useToast();
  const navigate = useNavigate();
  const [updateStep] = useUpdateLearningpathStep();
  const [deleteStep] = useDeleteLearningpathStep();
  const [createStep] = useCreateLearningpathStep();

  const methods = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: toFormValues(getFormTypeFromStep(step), step),
  });

  useEffect(() => {
    wrapperRef.current?.parentElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const learningpathId = learningpathIdParam ? Number(learningpathIdParam) : undefined;

  useEffect(() => {
    if (!step) {
      setTimeout(() => wrapperRef.current?.querySelector("input")?.focus(), 0);
    }
  }, [step]);

  useEffect(() => {
    if (!focusStepId || !learningpathId || methods.formState.isSubmitting) return;
    navigate(routes.myNdla.learningpathEditSteps(learningpathId), { state: { focusStepId } });
    setFocusStepId(undefined);
  }, [focusStepId, learningpathId, methods.formState.isSubmitting, navigate]);

  if (!learningpathId) return null;

  const onSave = async (values: FormValues) => {
    if (!learningpathId) return;
    const transformedData = formValuesToGQLInput(values);
    const language = learningPath.supportedLanguages[0] ?? "nb";

    if (!step) {
      const res = await createStep({
        variables: {
          learningpathId: learningpathId,
          // @ts-expect-error We use null instead of undefined to delete fields
          params: { ...transformedData, language, showTitle: false },
        },
      });

      if (!res.errors?.length) {
        toast.create({ title: t("myNdla.learningpath.toast.createdStep", { name: values.title }) });
        methods.reset();
        setFocusStepId(
          res.data?.newLearningpathStep.id ? learningpathStepEditButtonId(res.data?.newLearningpathStep.id) : undefined,
        );
      } else {
        toast.create({ title: t("myNdla.learningpath.toast.createdStepFailed", { name: values.title }) });
      }
    } else {
      const res = await updateStep({
        variables: {
          learningpathId: learningpathId,
          learningstepId: step.id,
          // @ts-expect-error We use null instead of undefined to delete fields
          params: { ...transformedData, language, revision: step?.revision },
        },
      });
      if (!res.errors?.length) {
        methods.reset();
        setFocusStepId(step ? learningpathStepEditButtonId(step.id) : undefined);
      } else {
        toast.create({ title: t("myNdla.learningpath.toast.updateStepFailed", { name: values.title }) });
      }
    }
  };

  const { handleSubmit, control, reset, formState } = methods;

  const onDelete = async (closeDialog: VoidFunction) => {
    if (!step) return;
    const res = await deleteStep({
      variables: {
        learningstepId: step.id,
        learningpathId: learningpathId,
      },
    });

    if (!res.errors?.length) {
      closeDialog();
      reset();
      toast.create({ title: t("myNdla.learningpath.toast.deletedStep", { name: step?.title }) });
      const el = document.getElementById(step.id.toString());
      const focusEl = [el?.nextElementSibling, el?.previousElementSibling]
        .find((el) => el?.tagName === "LI")
        ?.querySelector("div")
        ?.querySelector("a");
      navigate(routes.myNdla.learningpathEditSteps(learningpathId), {
        state: { focusStepId: focusEl?.id ?? SKIP_TO_CONTENT_ID },
        replace: true,
      });
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.deletedStepFailed", { name: step?.title }) });
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSave)();
  };

  return (
    <FormProvider {...methods}>
      <ContentForm onSubmit={onSubmit} noValidate ref={wrapperRef}>
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
        <StepFormType step={step} />
        <HStack justify={step ? "space-between" : "end"}>
          {step ? <LearningpathStepDeleteDialog onDelete={onDelete} /> : null}
          <HStack>
            <SafeLinkButton
              to={routes.myNdla.learningpathEditSteps(learningpathId)}
              state={{ focusStepId: step ? learningpathStepEditButtonId(step.id) : undefined }}
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
                articleId: step.articleId,
                resourceTypes: step.resource.resourceTypes,
                title: step.title,
                breadcrumbs: step.resource.breadcrumbs,
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
