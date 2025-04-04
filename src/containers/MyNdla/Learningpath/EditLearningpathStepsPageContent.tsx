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

const StyledOl = styled("ol", { base: { listStyle: "none", width: "100%" } });

const AddButton = styled(Button, { base: { width: "100%" } });

interface Props {
  // TODO
  learningpath: GQLMyNdlaLearningpathFragment;
}

const NO_SELECTED_LEARNINGPATH_STEP_ID = -2;
const ADD_NEW_LEARNINGPATH_STEP_ID = -1;

export const EditLearningpathStepsPageContent = ({ learningpath }: Props) => {
  const [sortedLearningpathSteps, setSortedLearningpathSteps] = useState(learningpath.learningsteps ?? []);
  const { t, i18n } = useTranslation();
  const [selectedLearningpathStepId, setSelectedLearningpathStepId] = useState<number>(
    NO_SELECTED_LEARNINGPATH_STEP_ID,
  );
  const [nextId, setNextId] = useState<number | undefined>(undefined);

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
    if (learningpath?.id) {
      const transformedData = formValuesToGQLInput(values);
      const res = await createStep({
        variables: {
          learningpathId: learningpath.id,
          params: { ...transformedData, language: i18n.language, showTitle: false },
        },
      });
      if (!res.errors?.length) {
        handleStateChanges(NO_SELECTED_LEARNINGPATH_STEP_ID);
        toast.create({ title: t("myNdla.learningpath.toast.createdStep", { name: values.title }) });
        headingRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        toast.create({ title: t("myNdla.learningpath.toast.createdStepFailed", { name: values.title }) });
      }
    }
  };

  // skipAlertDialog is for an edgecase when you have edited a step and then decide to delete. This will skip the unsaved edits dialog.
  const onFormChange = (val: number, skipAlertDialog?: boolean) => {
    if (formMethods.formState.isDirty && !formMethods.formState.isSubmitting && !skipAlertDialog) {
      setNextId(val);
    } else {
      handleStateChanges(val);
    }
  };

  const handleStateChanges = (val: number | undefined) => {
    //Reset the form to remove traces of changes
    formMethods.reset();
    setSelectedLearningpathStepId(val ?? NO_SELECTED_LEARNINGPATH_STEP_ID);
    setNextId(undefined);
  };

  const announcements = useMemo(
    () => makeDndTranslations("learningpathstep", t, sortedLearningpathSteps.length),
    [sortedLearningpathSteps, t],
  );

  const learningpathIds = useMemo(() => {
    return sortedLearningpathSteps.map((step) => step.id.toString());
  }, [sortedLearningpathSteps]);

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
        onAbort={() => setNextId(undefined)}
        onContinue={() => handleStateChanges(nextId)}
        isBlocking={!!nextId}
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
                    onClose={(skipAlert) => onFormChange(NO_SELECTED_LEARNINGPATH_STEP_ID, skipAlert)}
                    onSelect={() => onFormChange(step.id)}
                    index={index}
                  />
                ))}
              </StyledOl>
            </SortableContext>
          </DndContext>
        )}
        {selectedLearningpathStepId !== ADD_NEW_LEARNINGPATH_STEP_ID ? (
          <AddButton variant="secondary" onClick={() => onFormChange(ADD_NEW_LEARNINGPATH_STEP_ID)}>
            <AddLine />
            {t("myNdla.learningpath.form.steps.add")}
          </AddButton>
        ) : (
          <LearningpathStepForm
            stepType="text"
            onClose={() => onFormChange(NO_SELECTED_LEARNINGPATH_STEP_ID)}
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
