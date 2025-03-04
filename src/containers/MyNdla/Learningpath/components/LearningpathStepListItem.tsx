/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PencilLine, CloseLine } from "@ndla/icons";
import { Button, Text } from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { useToast } from "../../../../components/ToastContext";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import { useUpdateLearningpathStep, useDeleteLearningpathStep } from "../learningpathMutations";
import { FormValues } from "../types";
import { getFormTypeFromStep } from "../utils";
import LearningpathStepForm from "./LearningpathStepForm";
import { formValuesToGQLInput } from "../learningpathFormUtils";

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

interface LearningpathStepListItemProps {
  learningpathId: number;
  step: GQLMyNdlaLearningpathStepFragment;
}

export const LearningpathStepListItem = ({ step, learningpathId }: LearningpathStepListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [updateStep] = useUpdateLearningpathStep(learningpathId.toString());
  const [deleteStep] = useDeleteLearningpathStep(learningpathId.toString());

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
      setIsEditing(false);
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.updateStepFailed", { name: step.title }) });
    }
  };

  const onDelete = async (close: VoidFunction) => {
    const res = await deleteStep({
      variables: {
        learningstepId: step.id,
        learningpathId: learningpathId,
      },
    });
    if (!res.errors?.length) {
      toast.create({ title: t("myNdla.learningpath.toast.deletedStep", { name: step.title }) });
      close();
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.deletedStepFailed", { name: step.title }) });
    }
  };

  const stepType = getFormTypeFromStep(step);

  return (
    <li>
      <ContentWrapper editing={isEditing}>
        <Stack gap="xxsmall">
          <Text fontWeight="bold" textStyle="label.medium">
            {step.title}
          </Text>
          <Text textStyle="label.small">{t(`myNdla.learningpath.form.options.${stepType}`)}</Text>
        </Stack>
        {!isEditing ? (
          <Button variant="tertiary" onClick={() => setIsEditing(true)}>
            {t("myNdla.learningpath.form.steps.edit")} <PencilLine />
          </Button>
        ) : (
          <Button variant="tertiary" onClick={() => setIsEditing(false)}>
            <CloseLine />
            {t("close")}
          </Button>
        )}
      </ContentWrapper>
      {isEditing ? <LearningpathStepForm step={step} stepType={stepType} onSave={onSave} onDelete={onDelete} /> : null}
    </li>
  );
};
