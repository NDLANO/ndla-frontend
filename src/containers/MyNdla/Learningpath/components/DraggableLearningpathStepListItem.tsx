/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PencilLine, CloseLine } from "@ndla/icons";
import { ListItemContent, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { DragHandle } from "../../components/DragHandle";
import { getFormTypeFromStep, learningpathStepCloseButtonId, learningpathStepEditButtonId } from "../utils";
import { DraggableListItem } from "./DraggableListItem";
import { LearningpathStepForm } from "./LearningpathStepForm";

export const DragWrapper = styled("div", {
  base: {
    maxWidth: "100%",
    height: "100%",
    background: "surface.default",
    flexGrow: "1",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    flexDirection: "column",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
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
  index: number;
  language: string;
}

export const DraggableLearningpathStepListItem = ({
  step,
  learningpathId,
  index,
  language,
}: LearningpathStepListItemProps) => {
  const { t } = useTranslation();
  const { stepId } = useParams();

  const isEditingStep = useMemo(() => step.id === Number(stepId), [step.id, stepId]);

  const sortableId = step.id.toString();
  const { attributes, setNodeRef, transform, transition, isDragging, items } = useSortable({
    id: sortableId,
    data: {
      index: index + 1,
    },
  });

  const stepType = getFormTypeFromStep(step);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DraggableListItem id={sortableId} ref={setNodeRef} style={style} isDragging={isDragging}>
      <StyledDragHandle
        sortableId={sortableId}
        name={step.title}
        disabled={items.length < 2}
        type="learningpathstep"
        isHidden={!!stepId}
        aria-hidden={stepId ? true : undefined}
        {...attributes}
        tabIndex={stepId ? -1 : attributes.tabIndex}
      />
      <DragWrapper>
        <StyledListItemRoot nonInteractive>
          <ListItemContent>
            <TextWrapper>
              <Text fontWeight="bold" textStyle="label.medium">
                {step.title}
              </Text>
              <Text textStyle="label.small">{t(`myNdla.learningpath.form.options.${stepType}`)}</Text>
            </TextWrapper>
            {!isEditingStep ? (
              <SafeLinkButton
                variant="tertiary"
                id={learningpathStepEditButtonId(step.id)}
                to={routes.myNdla.learningpathEditStep(learningpathId, step.id)}
                state={{ focusStepId: learningpathStepCloseButtonId(step.id) }}
              >
                {t("myNdla.learningpath.form.steps.edit")}
                <PencilLine />
              </SafeLinkButton>
            ) : (
              <SafeLinkButton
                variant="tertiary"
                id={learningpathStepCloseButtonId(step.id)}
                to={routes.myNdla.learningpathEditSteps(learningpathId)}
                state={{ focusStepId: learningpathStepEditButtonId(step.id) }}
              >
                <CloseLine />
                {t("close")}
              </SafeLinkButton>
            )}
          </ListItemContent>
          {!!isEditingStep && <LearningpathStepForm step={step} language={language} />}
        </StyledListItemRoot>
      </DragWrapper>
    </DraggableListItem>
  );
};
