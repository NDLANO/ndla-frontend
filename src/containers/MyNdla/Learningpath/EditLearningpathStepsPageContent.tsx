/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddLine } from "@ndla/icons";
import { Button, Heading } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import LearningpathStepForm from "./components/LearningpathStepForm";
import { LearningpathStepListItem } from "./components/LearningpathStepListItem";
import { formValuesToGQLInput } from "./learningpathFormUtils";
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
  const [createStep] = useCreateLearningpathStep(learningpath.id.toString() ?? "");
  const toast = useToast();

  const onSaveStep = async (values: FormValues) => {
    if (learningpath?.id) {
      const transformedData = formValuesToGQLInput(values);
      const { errors } = await createStep({
        variables: {
          learningpathId: learningpath.id,
          params: { ...transformedData, language: i18n.language, showTitle: false },
        },
      });
      if (!errors?.length) {
        setSelectedLearningpathStepId(undefined);
        toast.create({ title: t("myNdla.learningpath.form.steps.created", { name: values.title }) });
      }
    }
  };

  return (
    <>
      <Stack gap="medium" justify="left">
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t("myNdla.learningpath.form.content.title")}</h2>
        </Heading>
        <StyledOl>
          {learningpath.learningsteps?.map((step) => (
            <LearningpathStepListItem
              learningpathId={learningpath.id ?? -1}
              step={step}
              key={step.id}
              selectedLearningpathStepId={selectedLearningpathStepId}
              setSelectedLearningpathStepId={setSelectedLearningpathStepId}
            />
          ))}
        </StyledOl>
        {!selectedLearningpathStepId || selectedLearningpathStepId !== -1 ? (
          <AddButton variant="secondary" onClick={() => setSelectedLearningpathStepId(-1)}>
            <AddLine />
            {t("myNdla.learningpath.form.steps.add")}
          </AddButton>
        ) : null}
        {selectedLearningpathStepId === -1 ? (
          <LearningpathStepForm
            stepType="text"
            onClose={() => setSelectedLearningpathStepId(undefined)}
            onSave={onSaveStep}
          />
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
