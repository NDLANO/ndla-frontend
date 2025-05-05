/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AddLine } from "@ndla/icons";
import { Button, Heading } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { AlertDialog } from "./components/AlertDialog";
import { DraggableLearningpathStepListItem } from "./components/DraggableLearningpathStepListItem";
import LearningpathStepForm from "./components/LearningpathStepForm";
import { formValuesToGQLInput, toFormValues } from "./learningpathFormUtils";
import { FormValues } from "./types";
import { useToast } from "../../../components/ToastContext";
import { GQLMyNdlaLearningpathFragment } from "../../../graphqlTypes";
import { useCreateLearningpathStep, useUpdateLearningpathStepSeqNo } from "../../../mutations/learningpathMutations";
import { routes } from "../../../routeHelpers";
import { makeDndTranslations } from "../dndUtil";
import { learningpathStepEditButtonId } from "./utils";

const StyledOl = styled("ol", { base: { listStyle: "none", width: "100%" } });

const AddButton = styled(Button, { base: { width: "100%" } });

interface Props {
  // TODO
  learningpath: GQLMyNdlaLearningpathFragment;
}

const NO_SELECTED_LEARNINGPATH_STEP_ID = -2;
const ADD_NEW_LEARNINGPATH_STEP_ID = -1;
const ADD_STEP_BUTTON_ID = "add-step-button";
const CREATE_STEP_FORM_ID = "create-step-form";

export const EditLearningpathStepsPageContent = ({ learningpath }: Props) => {
  const [sortedLearningpathSteps, setSortedLearningpathSteps] = useState(learningpath.learningsteps ?? []);
  const { t, i18n } = useTranslation();
  const [selectedLearningpathStepId, setSelectedLearningpathStepId] = useState<number>(
    NO_SELECTED_LEARNINGPATH_STEP_ID,
  );
  const [nextLearningpathStepId, setNextLearningpathStepId] = useState<number | undefined>(undefined);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  const [createStep] = useCreateLearningpathStep();
  const [updateLearningpathStepSeqNo] = useUpdateLearningpathStepSeqNo();
  const toast = useToast();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!learningpath.learningsteps) return;
    setSortedLearningpathSteps(learningpath.learningsteps);
  }, [learningpath.learningsteps]);

  const formMethods = useForm<FormValues>({ defaultValues: toFormValues("text") });

  const onSaveStep = async (values: FormValues) => {
    if (!learningpath?.id) return;

    const transformedData = formValuesToGQLInput(values);
    const res = await createStep({
      variables: {
        learningpathId: learningpath.id,
        params: { ...transformedData, language: i18n.language, showTitle: false },
      },
    });

    if (!res.errors?.length) {
      handleFormChange(NO_SELECTED_LEARNINGPATH_STEP_ID, learningpathStepEditButtonId(res.data?.newLearningpathStep));
      toast.create({ title: t("myNdla.learningpath.toast.createdStep", { name: values.title }) });
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.createdStepFailed", { name: values.title }) });
    }
  };

  // skipAlertDialog is for an edgecase when you have edited a step and then decide to delete. This will skip the unsaved edits dialog.
  const onFormChange = (val: number, nextFocusableId?: string, skipAlertDialog?: boolean) => {
    const isDirty = formMethods.formState.isDirty && !formMethods.formState.isSubmitting;
    if (isDirty && !skipAlertDialog) {
      setNextLearningpathStepId(val);
      setFocusId(nextFocusableId);
    } else {
      handleFormChange(val, nextFocusableId);
    }
  };

  const handleFormChange = (val?: number, nextFocusableId?: string) => {
    //Reset the form to remove traces of changes
    formMethods.reset();
    setSelectedLearningpathStepId(val ?? NO_SELECTED_LEARNINGPATH_STEP_ID);
    setNextLearningpathStepId(undefined);

    const focus = nextFocusableId ?? focusId;
    if (focus === CREATE_STEP_FORM_ID) {
      setTimeout(() => document.querySelector("form")?.querySelector("input")?.focus(), 1);
      setFocusId(undefined);
    } else if (focus) {
      setTimeout(() => document.getElementById(focus)?.focus(), 0);
      setFocusId(undefined);
    }
  };

  const announcements = useMemo(
    () => makeDndTranslations("learningpathstep", t, sortedLearningpathSteps.length),
    [sortedLearningpathSteps, t],
  );

  const learningpathIds = useMemo(
    () => sortedLearningpathSteps.map((step) => step.id.toString()),
    [sortedLearningpathSteps],
  );

  const onError = () => toast.create({ title: t("myNdla.learningpathstep.error") });

  const onDragEnd = async (event: DragEndEvent) => {
    try {
      const { active, over } = event;
      if (over?.data.current && active.data.current) {
        const oldIndex = learningpathIds.indexOf(active.id as string);
        const newIndex = learningpathIds.indexOf(over.id as string);

        if (newIndex === undefined || newIndex === oldIndex) return;

        const sortedArr = arrayMove(sortedLearningpathSteps, oldIndex, newIndex);
        const dropped = sortedLearningpathSteps.find((step) => step.id === Number(active.id));

        setSortedLearningpathSteps(sortedArr);
        const res = await updateLearningpathStepSeqNo({
          variables: { learningpathId: learningpath.id, learningpathStepId: dropped?.id ?? -1, seqNo: newIndex },
        });
        if (res.errors?.length) {
          onError();
        }
      }
    } catch (err) {
      onError();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <FormProvider {...formMethods}>
      <AlertDialog
        onAbort={() => setNextLearningpathStepId(undefined)}
        onContinue={() => handleFormChange(nextLearningpathStepId)}
        isBlocking={!!nextLearningpathStepId}
      />
      <Stack gap="medium" justify="left">
        <Heading textStyle="heading.small" asChild consumeCss ref={headingRef}>
          <h2>{t("myNdla.learningpath.form.content.title")}</h2>
        </Heading>

        {!!sortedLearningpathSteps.length && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
            accessibility={{ announcements }}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={learningpathIds}
              disabled={sortedLearningpathSteps.length < 2}
              strategy={verticalListSortingStrategy}
            >
              <StyledOl>
                {sortedLearningpathSteps.map((step, index) => (
                  <DraggableLearningpathStepListItem
                    key={`${step.id.toString()}`}
                    step={step}
                    learningpathId={learningpath.id}
                    selectedLearningpathStepId={selectedLearningpathStepId}
                    onClose={(skipAlert) =>
                      onFormChange(NO_SELECTED_LEARNINGPATH_STEP_ID, learningpathStepEditButtonId(step), skipAlert)
                    }
                    onSelect={() => onFormChange(step.id)}
                    index={index}
                  />
                ))}
              </StyledOl>
            </SortableContext>
          </DndContext>
        )}
        {selectedLearningpathStepId !== ADD_NEW_LEARNINGPATH_STEP_ID ? (
          <AddButton
            id={ADD_STEP_BUTTON_ID}
            variant="secondary"
            onClick={() => {
              onFormChange(ADD_NEW_LEARNINGPATH_STEP_ID, CREATE_STEP_FORM_ID);
            }}
          >
            <AddLine />
            {t("myNdla.learningpath.form.steps.add")}
          </AddButton>
        ) : (
          <LearningpathStepForm
            stepType="text"
            onClose={() => onFormChange(NO_SELECTED_LEARNINGPATH_STEP_ID, ADD_STEP_BUTTON_ID)}
            onSave={onSaveStep}
          />
        )}
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
