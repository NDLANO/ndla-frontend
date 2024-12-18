/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { AddLine } from "@ndla/icons";
import { ALL_ABBREVIATIONS } from "@ndla/licenses";
import { Button, Heading, Spinner, Text } from "@ndla/primitives";
import { HStack, Stack, styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { FormValues, LearningpathStepForm } from "./components/LearningpathStepForm";
import { useCreateLearningpathStep, useUpdateLearningpath } from "./learningpathMutations";
import { useFetchLearningpath } from "./learningpathQueries";
import { formValuesToGQLInput } from "./utils";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { LearningpathStepListItem } from "./components/LearningpathStepListItem";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { TitleForm, TitleFormValues } from "./components/TitleForm";

const StyledOl = styled("ol", {
  base: {
    listStyle: "none",
    width: "100%",
  },
});

const AddButton = styled(Button, {
  base: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: "small",
  },
});

const StyledHStack = styled(HStack, {
  base: {
    width: "100%",
  },
});

export type SchemaStates = "title" | "content" | "preview" | "save";
interface SchemaOrientation {
  prev: SchemaStates | undefined;
  next: SchemaStates | undefined;
}

const SCHEMA_STATES: Record<SchemaStates, SchemaOrientation> = {
  title: {
    prev: undefined,
    next: "content",
  },
  content: {
    prev: "title",
    next: "preview",
  },
  preview: {
    prev: "content",
    next: "save",
  },
  save: {
    prev: "preview",
    next: undefined,
  },
};

export const EditLearningpathPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [state, setState] = useState<SchemaStates>("content");

  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { learningpathId } = useParams();
  const { user } = useContext(AuthContext);

  const { data, loading } = useFetchLearningpath({
    variables: { pathId: parseInt(learningpathId!) },
    skip: !learningpathId,
  });

  const [createStep] = useCreateLearningpathStep();
  const [updatePath] = useUpdateLearningpath();

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.arenaNewCategoryPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  const onSaveStep = async (values: FormValues) => {
    if (data?.myNdlaLearningpath?.id) {
      const transformedData = formValuesToGQLInput(values);
      await createStep({
        variables: {
          learningpathId: data.myNdlaLearningpath.id,
          params: { ...transformedData, license: ALL_ABBREVIATIONS[4], language: i18n.language, showTitle: false },
        },
      });
    }
  };

  const onSaveTitle = async ({ title, imageUrl }: TitleFormValues) => {
    if (
      data?.myNdlaLearningpath &&
      (data.myNdlaLearningpath.title !== title || data.myNdlaLearningpath.coverphoto?.url !== imageUrl)
    ) {
      await updatePath({
        variables: {
          learningpathId: data.myNdlaLearningpath.id,
          params: {
            title,
            coverPhotoMetaUrl: imageUrl,
            description: " ",
            language: i18n.language,
            revision: data.myNdlaLearningpath.revision,
          },
        },
      });
    }
    setState("content");
  };

  if (loading) {
    return <Spinner />;
  }

  if (!data?.myNdlaLearningpath) {
    return <Navigate to={routes.myNdla.learningpath} />;
  }

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: `${t("myNdla.learningpath.newLearningpath")}` }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {data.myNdlaLearningpath.title}
      </Heading>
      <LearningpathStepper step={state} />
      {state === "title" ? (
        <TitleForm
          onSave={onSaveTitle}
          initialValues={{
            title: data.myNdlaLearningpath.title,
            imageUrl: data.myNdlaLearningpath.coverphoto?.url ?? "",
          }}
        />
      ) : null}
      {state === "content" ? (
        <Stack gap="medium" justify="left">
          <Heading textStyle="heading.small" asChild consumeCss>
            <h2>{t("myNdla.learningpath.form.content.title")}</h2>
          </Heading>
          <Text textStyle="body.large">{t("myNdla.learningpath.form.content.subTitle")}</Text>
          <StyledOl>
            {data.myNdlaLearningpath.learningsteps.map((step) => (
              // TODO: Remove this when typescript is
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              <LearningpathStepListItem learningpathId={data.myNdlaLearningpath?.id!} step={step} key={step.id} />
            ))}
          </StyledOl>
          {!isCreating ? (
            <AddButton variant="secondary" onClick={() => setIsCreating(true)}>
              <AddLine />
              {t("myNdla.learningpath.form.steps.add")}
            </AddButton>
          ) : (
            <LearningpathStepForm
              learningpathId={data.myNdlaLearningpath.id}
              onClose={() => setIsCreating(false)}
              onSave={onSaveStep}
            />
          )}
        </Stack>
      ) : null}
      <StyledHStack justify="space-between">
        {state !== "title" && SCHEMA_STATES[state].prev ? (
          <StyledHStack justify="flex-start">
            <Button variant="secondary" onClick={() => setState(SCHEMA_STATES[state].prev!)}>
              {t("myNdla.learningpath.form.back")}
            </Button>
          </StyledHStack>
        ) : null}
        {state !== "save" && SCHEMA_STATES[state].next ? (
          <StyledHStack justify="flex-end">
            {state === "title" ? (
              <Button type="submit" form="titleForm">
                {t("myNdla.learningpath.form.next")}
              </Button>
            ) : (
              <Button onClick={() => setState(SCHEMA_STATES[state].next!)}>{t("myNdla.learningpath.form.next")}</Button>
            )}
          </StyledHStack>
        ) : null}
      </StyledHStack>
    </MyNdlaPageWrapper>
  );
};
