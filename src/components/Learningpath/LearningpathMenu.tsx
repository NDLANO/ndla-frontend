/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { CheckLine } from "@ndla/icons";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleByline } from "@ndla/ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { GQLLearningpathMenu_LearningpathFragment } from "../../graphqlTypes";
import { routes, toLearningPath } from "../../routeHelpers";
import { formatDate } from "../../util/formatDate";
import { StepperIndicator, StepperList, StepperListItem, StepperRoot, StepperSafeLink } from "../Stepper";
import { LearningpathContext } from "./learningpathUtils";

interface Props {
  resourcePath: string | undefined;
  learningpath: GQLLearningpathMenu_LearningpathFragment;
  currentIndex: number | undefined;
  context?: LearningpathContext;
  hasIntroduction: boolean;
}

const StyledStepperListItem = styled(StepperListItem, {
  variants: {
    context: {
      default: {
        desktop: {
          background: "background.subtle",
        },
      },
      preview: {},
    },
  },
  defaultVariants: {
    context: "default",
  },
});

const stepLink = (
  learningpathId: number,
  stepId: number | undefined,
  resourcePath: string | undefined,
  context: LearningpathContext | undefined,
) => {
  return context === "preview"
    ? routes.myNdla.learningpathPreview(learningpathId, stepId)
    : toLearningPath(learningpathId, stepId, resourcePath);
};

const LEARNING_PATHS_STORAGE_KEY = "LEARNING_PATHS_COOKIES_KEY";

const INTRODUCTION_ID = "intro";

export const LearningpathMenu = ({ resourcePath, learningpath, currentIndex, context, hasIntroduction }: Props) => {
  const [viewedSteps, setViewedSteps] = useState<Record<string, boolean>>({});
  const { t, i18n } = useTranslation();

  const currentStep = currentIndex !== undefined ? learningpath.learningsteps[currentIndex] : undefined;
  const lastUpdated = formatDate(learningpath.lastUpdated, i18n.language);
  const indicatorOffset = hasIntroduction ? 2 : 1;
  const introductionCompleted = !!viewedSteps[INTRODUCTION_ID];

  const updateViewedSteps = () => {
    const viewedId =
      learningpath && currentStep?.seqNo !== undefined
        ? currentStep.id
        : hasIntroduction && !currentIndex
          ? INTRODUCTION_ID
          : undefined;

    if (viewedId) {
      const storageKey = `${LEARNING_PATHS_STORAGE_KEY}_${learningpath.id}`;
      const currentViewedSteps = window.localStorage?.getItem(storageKey);
      const updatedViewedSteps = currentViewedSteps ? JSON.parse(currentViewedSteps) : {};
      setViewedSteps(updatedViewedSteps);
      updatedViewedSteps[viewedId] = true;
      window.localStorage?.setItem(storageKey, JSON.stringify(updatedViewedSteps));
    }
  };

  useEffect(() => {
    updateViewedSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep?.id]);

  return (
    <>
      <StepperRoot aria-label={t("learningpathPage.learningsteps")}>
        <StepperList>
          {!!hasIntroduction && (
            <StyledStepperListItem context={context} completed={!!introductionCompleted && currentIndex !== undefined}>
              <StepperIndicator>
                {introductionCompleted && currentIndex !== undefined ? <CheckLine size="small" /> : 1}
              </StepperIndicator>
              <StepperSafeLink
                to={stepLink(learningpath.id, undefined, resourcePath, context)}
                aria-current={currentIndex === undefined ? "page" : undefined}
                aria-label={`${t("learningpathPage.introduction")}${introductionCompleted ? `. ${t("learningpathPage.stepCompleted")}` : ""}`}
              >
                {t("learningpathPage.introduction")}
              </StepperSafeLink>
            </StyledStepperListItem>
          )}
          {learningpath.learningsteps.map((step, index) => (
            <StyledStepperListItem
              key={step.id}
              context={context}
              completed={!!viewedSteps[step.id] && currentIndex !== index}
            >
              <StepperIndicator>
                {viewedSteps[step.id] && index !== currentIndex ? <CheckLine size="small" /> : index + indicatorOffset}
              </StepperIndicator>
              <StepperSafeLink
                to={stepLink(learningpath.id, step.id, resourcePath, context)}
                aria-current={currentIndex === index ? "page" : undefined}
                aria-label={`${step.title}${viewedSteps[step.id] ? `. ${t("learningpathPage.stepCompleted")}` : ""}`}
              >
                {step.title}
              </StepperSafeLink>
            </StyledStepperListItem>
          ))}
        </StepperList>
      </StepperRoot>
      <ArticleByline
        authors={learningpath.copyright.contributors}
        published={lastUpdated}
        bylineType="learningPath"
        bylineSuffix={learningpath.isMyNDLAOwner ? <Text>{t("learningpathPage.bylineSuffix")}</Text> : null}
        learningpathCopiedFrom={learningpath.basedOn ? config.ndlaFrontendDomain + learningpath.basedOn : undefined}
      />
    </>
  );
};

LearningpathMenu.fragments = {
  learningpath: gql`
    fragment LearningpathMenu_Learningpath on Learningpath {
      id
      title
      introduction
      lastUpdated
      copyright {
        license {
          license
        }
        contributors {
          type
          name
        }
      }
      learningsteps {
        id
        title
        seqNo
      }
      basedOn
      isMyNDLAOwner
    }
  `,
  step: gql`
    fragment LearningpathMenu_LearningpathStep on LearningpathStep {
      id
      seqNo
    }
  `,
};
