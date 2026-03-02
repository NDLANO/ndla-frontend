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
import { usePrevious } from "@ndla/util";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { GQLLearningpathMenu_LearningpathFragment } from "../../graphqlTypes";
import { routes, toLearningPath } from "../../routeHelpers";
import { formatDate } from "../../util/formatDate";
import { FavoriteButton } from "../Article/FavoritesButton";
import { AuthContext } from "../AuthenticationContext";
import { AddResourceToFolderModal } from "../MyNdla/AddResourceToFolderModal";
import { Launchpad } from "../Resource/Launchpad";
import { StepperIndicator, StepperList, StepperListItem, StepperRoot, StepperSafeLink } from "../Stepper";
import { CopyLearningPath } from "./components/CopyLearningPath";
import { LearningpathContext } from "./learningpathUtils";

interface Props {
  resourcePath: string | undefined;
  learningpath: GQLLearningpathMenu_LearningpathFragment | undefined;
  currentIndex: number | undefined;
  context?: LearningpathContext;
  displayContext: "mobile" | "desktop";
  loading: boolean;
  hasIntroduction: boolean;
}

const StyledStepperList = styled(StepperList, {
  base: {
    gap: "xxsmall",
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

const INTRODUCTION_ID = -1;

export const LearningpathMenu = ({
  resourcePath,
  learningpath,
  currentIndex,
  context,
  hasIntroduction,
  displayContext,
  loading,
}: Props) => {
  const currentStep = currentIndex !== undefined ? learningpath?.learningsteps[currentIndex] : undefined;
  const currentId =
    learningpath && currentStep?.seqNo !== undefined
      ? currentStep.id
      : hasIntroduction && !currentIndex
        ? INTRODUCTION_ID
        : undefined;
  const previousCurrentId = usePrevious(currentId);
  const [completed, setCompleted] = useState<number[]>(currentId ? [currentId] : []);
  const { t, i18n } = useTranslation();

  const indicatorOffset = hasIntroduction ? 2 : 1;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (previousCurrentId) {
      setCompleted((prev) => (prev.includes(previousCurrentId) ? prev : prev.concat(previousCurrentId)));
    }
  }, [previousCurrentId]);

  return (
    <Launchpad
      type={t("contentTypes.learningpath")}
      name={learningpath?.title ?? ""}
      context={displayContext}
      actions={
        learningpath ? (
          <>
            <AddResourceToFolderModal
              resource={{
                id: learningpath.id.toString(),
                path: resourcePath ?? toLearningPath(learningpath.id),
                resourceType: "learningpath",
              }}
            >
              <FavoriteButton path={resourcePath ?? toLearningPath(learningpath.id)} />
            </AddResourceToFolderModal>
            {user?.role === "employee" && <CopyLearningPath learningpath={learningpath} />}
          </>
        ) : null
      }
      loading={loading}
    >
      {(collapsed) =>
        !learningpath ? undefined : (
          <>
            <StepperRoot
              aria-label={t("learningpathPage.learningsteps")}
              line
              aria-hidden={collapsed}
              collapsed={collapsed}
            >
              <StyledStepperList>
                {!!hasIntroduction && (
                  <StepperListItem
                    completed={completed.includes(INTRODUCTION_ID)}
                    // for collapsed styling
                    data-current={currentIndex === undefined ? "" : undefined}
                  >
                    <StepperIndicator>
                      {completed.includes(INTRODUCTION_ID) && currentIndex !== undefined ? (
                        <CheckLine size="small" />
                      ) : (
                        1
                      )}
                    </StepperIndicator>
                    {!collapsed && (
                      <StepperSafeLink
                        to={stepLink(learningpath.id, undefined, resourcePath, context)}
                        aria-current={currentIndex === undefined ? "page" : undefined}
                        aria-label={`${t("learningpathPage.introduction")}${completed.includes(INTRODUCTION_ID) ? `. ${t("learningpathPage.stepCompleted")}` : ""}`}
                      >
                        {t("learningpathPage.introduction")}
                      </StepperSafeLink>
                    )}
                  </StepperListItem>
                )}
                {learningpath.learningsteps.map((step, index) => (
                  <StepperListItem
                    key={step.id}
                    completed={completed.includes(step.id)}
                    // for collapsed styling
                    data-current={currentIndex === index ? "" : undefined}
                  >
                    <StepperIndicator>
                      {completed.includes(step.id) && index !== currentIndex ? (
                        <CheckLine size="small" />
                      ) : (
                        index + indicatorOffset
                      )}
                    </StepperIndicator>
                    {!collapsed && (
                      <StepperSafeLink
                        to={stepLink(learningpath.id, step.id, resourcePath, context)}
                        aria-current={currentIndex === index ? "page" : undefined}
                        aria-label={`${step.title}${completed.includes(step.id) ? `. ${t("learningpathPage.stepCompleted")}` : ""}`}
                      >
                        {step.title}
                      </StepperSafeLink>
                    )}
                  </StepperListItem>
                ))}
              </StyledStepperList>
            </StepperRoot>
            {!collapsed && (
              <ArticleByline
                authors={learningpath.copyright.contributors}
                published={formatDate(learningpath.lastUpdated, i18n.language)}
                bylineType="learningPath"
                bylineSuffix={learningpath.isMyNDLAOwner ? <Text>{t("learningpathPage.bylineSuffix")}</Text> : null}
                learningpathCopiedFrom={
                  learningpath.basedOn ? config.ndlaFrontendDomain + learningpath.basedOn : undefined
                }
              />
            )}
          </>
        )
      }
    </Launchpad>
  );
};

LearningpathMenu.fragments = {
  learningpath: gql`
    fragment LearningpathMenu_Learningpath on BaseLearningpath {
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
    fragment LearningpathMenu_LearningpathStep on BaseLearningpathStep {
      id
      seqNo
    }
  `,
};
