/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { PencilLine, CloseLine } from "@ndla/icons";
import { Button, Text } from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { useToast } from "../../../../components/ToastContext";
import { GQLMyNdlaLearningpathFragment, GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
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
  learningpath: GQLMyNdlaLearningpathFragment;
  step: GQLMyNdlaLearningpathStepFragment;
  selectedLearningpathStepId: number | undefined;
  setSelectedLearningpathStepId: (val: number | undefined) => void;
}

export const LearningpathStepListItem = ({
  step,
  learningpath,
  selectedLearningpathStepId,
  setSelectedLearningpathStepId,
}: LearningpathStepListItemProps) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [updateStep] = useUpdateLearningpathStep();
  const [deleteStep] = useDeleteLearningpathStep();

  const onSave = async (data: FormValues) => {
    const transformedData = formValuesToGQLInput(data);
    const res = await updateStep({
      variables: {
        learningpathId: learningpath.id,
        learningstepId: step.id,
        params: { ...transformedData, language: i18n.language, revision: step.revision },
      },
    });

    if (!res.errors?.length) {
      setSelectedLearningpathStepId(undefined);
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.updateStepFailed", { name: step.title }) });
    }
  };

  const onDelete = async (close: VoidFunction) => {
    const res = await deleteStep({
      variables: {
        learningstepId: step.id,
        learningpathId: learningpath.id,
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
      <ContentWrapper editing={step.id === selectedLearningpathStepId}>
        <Stack gap="xxsmall">
          <Text fontWeight="bold" textStyle="label.medium">
            {step.title}
          </Text>
          <Text textStyle="label.small">{t(`myNdla.learningpath.form.options.${stepType}`)}</Text>
        </Stack>
        {step.id !== selectedLearningpathStepId ? (
          <Button variant="tertiary" onClick={() => setSelectedLearningpathStepId(step.id)}>
            {t("myNdla.learningpath.form.steps.edit")} <PencilLine />
          </Button>
        ) : (
          <Button variant="tertiary" onClick={() => setSelectedLearningpathStepId(undefined)}>
            <CloseLine />
            {t("close")}
          </Button>
        )}
      </ContentWrapper>
      {step.id === selectedLearningpathStepId ? (
        <LearningpathStepForm stepType={stepType} step={step} onSave={onSave} onDelete={onDelete} />
      ) : null}
    </li>
  );
};
