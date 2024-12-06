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
import { AddLine, CloseLine, PencilLine } from "@ndla/icons";
import { Button, Heading, Spinner, Text } from "@ndla/primitives";
import { styled, VStack } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { FormType, FormValues, LearningpathStepForm } from "./components/LearningpathStepForm";
import { LearningPathStepper } from "./components/LearningPathStepper";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { useCreateLearningpathStep, useUpdateLearningpathStep } from "../learningpathMutations";
import { useFetchLearningpath } from "../learningpathQueries";

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
const createInputParams = (values: FormValues) => {
  if (values.type === "text") {
    return {
      title: values.title,
      introduction: values.introduction,
      description: values.description,
    };
  } else if (values.type === "external") {
    return {
      title: values.title,
      introduction: values.introduction,
      embedUrl: {
        url: values.url,
        embedType: "iframe",
      },
    };
  } else if (values.type === "resource") {
    return {
      title: values.title,
      embedUrl: {
        url: values.embedUrl,
        embedType: "oembed",
      },
    };
  }
  return { title: values.title };
};

const getLearningstepApiType = (type?: FormType) => {
  if (type === "text") {
    return "TEXT";
  } else if (type === "external") {
    return "OEMBED";
  }
  return "OEMBED";
};

const formValuesToGQLInput = (values: FormValues) => {
  const data = createInputParams(values);
  const type = getLearningstepApiType(values.type);
  /** TODO: Make prettier */
  // Unsets optional data if step changes type
  return {
    embedUrl: undefined,
    introduction: undefined,
    description: undefined,
    type: type,
    ...data,
  };
};

export const ContentLearningpathPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { learningpathId } = useParams();
  const { user } = useContext(AuthContext);

  const { learningpath, loading } = useFetchLearningpath({
    variables: { pathId: learningpathId! },
    skip: !learningpathId,
  });

  const [createStep] = useCreateLearningpathStep();

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.arenaNewCategoryPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  const onSave = async (data: FormValues) => {
    if (learningpath?.id) {
      const transformedData = formValuesToGQLInput(data);
      await createStep({
        variables: {
          learningpathId: learningpath.id,
          params: { ...transformedData, license: "", language: i18n.language, showTitle: false },
        },
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!learningpath) {
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
        {learningpath?.title}
      </Heading>
      <LearningPathStepper stepKey="content" />
      <VStack gap="medium">
        <StyledOl>
          {learningpath?.learningsteps.map((step) => (
            <LearningpathStepListItem learningpathId={learningpath.id} step={step} key={step.id} />
          ))}
        </StyledOl>
        {!isCreating ? (
          <AddButton variant="secondary" onClick={() => setIsCreating(true)}>
            <AddLine />
            {t("myNdla.learningpath.form.steps.add")}
          </AddButton>
        ) : (
          <LearningpathStepForm learningpathId={learningpath.id} onClose={() => setIsCreating(false)} onSave={onSave} />
        )}
      </VStack>
    </MyNdlaPageWrapper>
  );
};

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    borderRadius: "4px",
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

const LearningpathStepListItem = ({ step, learningpathId }: LearningpathStepListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { t, i18n } = useTranslation();

  const [updateStep] = useUpdateLearningpathStep();

  const onSave = async (data: FormValues) => {
    const transformedData = formValuesToGQLInput(data);
    await updateStep({
      variables: {
        learningpathId: learningpathId,
        learningstepId: step.id,
        params: { ...transformedData, language: i18n.language, revision: step.revision },
      },
    });
  };

  return (
    <li>
      <ContentWrapper editing={isEditing}>
        <TextWrapper>
          <Text fontWeight="bold" textStyle="label.medium">
            {step.title}
          </Text>
          <Text textStyle="label.small">{"Innhold fra NDLA"}</Text>
        </TextWrapper>
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
      {isEditing ? <LearningpathStepForm learningpathId={learningpathId} step={step} onSave={onSave} /> : null}
    </li>
  );
};
