/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PencilLine, CloseLine } from "@ndla/icons";
import { Button, Text } from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { useToast } from "../../../../components/ToastContext";
import { SKIP_TO_CONTENT_ID } from "../../../../constants";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import { useUpdateLearningpathStep, useDeleteLearningpathStep } from "../../../../mutations/learningpathMutations";
import { FormValues } from "../types";
import { getFormTypeFromStep, learningpathStepEditButtonId } from "../utils";
import LearningpathStepForm from "./LearningpathStepForm";
import { formValuesToGQLInput } from "../learningpathFormUtils";
import { DraggableListItem } from "./DraggableListItem";
import DragHandle from "../../components/DragHandle";

export const DragWrapper = styled("div", {
  base: {
    maxWidth: "100%",
    height: "100%",
    background: "surface.default",
    flexGrow: "1",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    padding: "xsmall",
  },
  variants: {
    editing: {
      true: {
        backgroundColor: "surface.subtle.selected",
        borderInline: "1px solid",
        borderBlockStart: "1px solid",
        borderBlockEnd: "none",
        borderColor: "stroke.discrete",
        borderRadius: "unset",
      },
    },
  },
});

const StyledDragHandle = styled(DragHandle, {
  variants: {
    isHidden: {
      true: {
        opacity: "0",
        pointerEvents: "none",
      },
    },
  },
});

interface LearningpathStepListItemProps {
  learningpathId: number;
  step: GQLMyNdlaLearningpathStepFragment;
  selectedLearningpathStepId: number | undefined;
  onClose: (skipAlert?: boolean) => void;
  onSelect: VoidFunction;
  index: number;
}

export const DraggableLearningpathStepListItem = ({
  step,
  learningpathId,
  selectedLearningpathStepId,
  onClose,
  onSelect,
  index,
}: LearningpathStepListItemProps) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [updateStep] = useUpdateLearningpathStep();
  const [deleteStep] = useDeleteLearningpathStep();

  const sortableId = step.id.toString();
  const { attributes, setNodeRef, transform, transition, isDragging, items } = useSortable({
    id: sortableId,
    data: {
      index: index + 1,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onSave = async (data: FormValues) => {
    const transformedData = formValuesToGQLInput(data);
    const res = await updateStep({
      variables: {
        learningpathId: learningpathId,
        learningstepId: step.id,
        params: { ...transformedData, language: i18n.language, revision: step.revision },
      },
    });

    if (!res.errors?.length) {
      onClose();
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.updateStepFailed", { name: step.title }) });
    }
  };

  const onDelete = async (closeDialog: VoidFunction) => {
    const el = document.getElementById(step.id.toString());
    const focusEl = [el?.nextElementSibling, el?.previousElementSibling]
      .find((el) => el?.tagName === "LI")
      ?.querySelector("div")
      ?.querySelector("button");

    const res = await deleteStep({
      variables: {
        learningstepId: step.id,
        learningpathId: learningpathId,
      },
    });

    if (!res.errors?.length) {
      onClose(true);
      closeDialog();
      toast.create({ title: t("myNdla.learningpath.toast.deletedStep", { name: step.title }) });
      setTimeout(() => (focusEl ?? document.getElementById(SKIP_TO_CONTENT_ID))?.focus(), 0);
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.deletedStepFailed", { name: step.title }) });
    }
  };

  const stepType = getFormTypeFromStep(step);

  const isDraggable = useMemo(
    () => selectedLearningpathStepId === -1 || selectedLearningpathStepId === -2,
    [selectedLearningpathStepId],
  );

  return (
    <DraggableListItem id={sortableId} ref={setNodeRef} style={style} isDragging={isDragging}>
      {isDraggable ? (
        <StyledDragHandle
          sortableId={sortableId}
          name={step.title}
          disabled={items.length < 2}
          type="learningpathstep"
          {...attributes}
        />
      ) : null}
      <DragWrapper>
        <ContentWrapper editing={step.id === selectedLearningpathStepId}>
          <Stack gap="xxsmall">
            <Text fontWeight="bold" textStyle="label.medium">
              {step.title}
            </Text>
            <Text textStyle="label.small">{t(`myNdla.learningpath.form.options.${stepType}`)}</Text>
          </Stack>
          {step.id !== selectedLearningpathStepId ? (
            <Button variant="tertiary" onClick={onSelect} id={learningpathStepEditButtonId(step)}>
              {t("myNdla.learningpath.form.steps.edit")}
              <PencilLine />
            </Button>
          ) : (
            <Button variant="tertiary" onClick={() => onClose()}>
              <CloseLine />
              {t("close")}
            </Button>
          )}
        </ContentWrapper>
        {step.id === selectedLearningpathStepId ? (
          <LearningpathStepForm step={step} stepType={stepType} onSave={onSave} onDelete={onDelete} />
        ) : null}
      </DragWrapper>
    </DraggableListItem>
  );
};
