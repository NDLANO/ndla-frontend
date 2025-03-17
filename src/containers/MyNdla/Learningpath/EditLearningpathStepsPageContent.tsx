/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
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
import { DraggableLearningpathStepListItem } from "./components/DraggableLearningpathStepListItem";
import LearningpathStepForm from "./components/LearningpathStepForm";
import { formValuesToGQLInput } from "./learningpathFormUtils";
import { useCreateLearningpathStep, useUpdateLearningpathStepSeqNo } from "./learningpathMutations";
import { FormValues } from "./types";
import { useToast } from "../../../components/ToastContext";
import { GQLMyNdlaLearningpathFragment } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { makeDndTranslations } from "../dndUtil";

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

const CREATE_STEP_ID = "create-step";
const CREATE_STEP_FORM_ID = "create-step";

interface Props {
  // TODO
  learningpath: GQLMyNdlaLearningpathFragment;
}

export const EditLearningpathStepsPageContent = ({ learningpath }: Props) => {
  const [sortedLearningpathSteps, setSortedLearningpathSteps] = useState(learningpath.learningsteps ?? []);
  const { t, i18n } = useTranslation();
  const [selectedLearningpathStepId, setSelectedLearningpathStepId] = useState<undefined | number>(undefined);
  const [createStep] = useCreateLearningpathStep();
  const [updateLearningpathStepSeqNo] = useUpdateLearningpathStepSeqNo();
  const toast = useToast();

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
        setSelectedLearningpathStepId(undefined);
        toast.create({ title: t("myNdla.learningpath.toast.createdStep", { name: values.title }) });
        setTimeout(
          () =>
            document
              .getElementById(res.data?.newLearningpathStep.id.toString() ?? "-1")
              ?.querySelector("div")
              ?.querySelector("button")
              ?.focus(),
          0,
        );
      } else {
        toast.create({ title: t("myNdla.learningpath.toast.createdStepFailed", { name: values.title }) });
      }
    }
  };

  useEffect(() => {
    if (!learningpath.learningsteps) return;
    setSortedLearningpathSteps(learningpath.learningsteps);
  }, [learningpath.learningsteps]);

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
          variables: {
            learningpathId: learningpath.id,
            learningpathStepId: dropped?.id ?? -1,
            seqNo: newIndex,
          },
        });
        if (res.errors?.length) {
          onError();
        }
      }
    } catch (err) {
      onError();
    }
  };

  const onOpenCreate = async () => {
    setSelectedLearningpathStepId(-1);
    setTimeout(() => document.getElementById(CREATE_STEP_FORM_ID)?.querySelector("input")?.focus(), 500);
  };

  const onCloseCreate = async () => {
    setSelectedLearningpathStepId(undefined);
    setTimeout(() => document.getElementById(CREATE_STEP_ID)?.focus(), 0);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <>
      <Stack gap="medium" justify="left">
        <Heading textStyle="heading.small" asChild consumeCss>
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
                    learningpathId={learningpath.id ?? -1}
                    step={step}
                    selectedLearningpathStepId={selectedLearningpathStepId}
                    setSelectedLearningpathStepId={setSelectedLearningpathStepId}
                    index={index}
                  />
                ))}
              </StyledOl>
            </SortableContext>
          </DndContext>
        )}
        {!selectedLearningpathStepId || selectedLearningpathStepId !== -1 ? (
          <AddButton id={CREATE_STEP_ID} variant="secondary" onClick={onOpenCreate}>
            <AddLine />
            {t("myNdla.learningpath.form.steps.add")}
          </AddButton>
        ) : null}
        {selectedLearningpathStepId === -1 ? (
          <LearningpathStepForm stepType="text" onClose={onCloseCreate} onSave={onSaveStep} id={CREATE_STEP_FORM_ID} />
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
    </>
  );
};

export default EditLearningpathStepsPageContent;
