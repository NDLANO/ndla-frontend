/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { CheckLine } from "@ndla/icons/editor";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleByline } from "@ndla/ui";
import {
  GQLLearningpathMenu_LearningpathFragment,
  GQLLearningpathMenu_LearningpathStepFragment,
} from "../../graphqlTypes";
import { toLearningPath } from "../../routeHelpers";

interface Props {
  resourcePath: string | undefined;
  learningpath: GQLLearningpathMenu_LearningpathFragment;
  currentStep: GQLLearningpathMenu_LearningpathStepFragment;
}

const StepperList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    zIndex: "1",
    gap: "xxsmall",
    textStyle: "body.link",
    _hover: {
      "& [data-indicator]": {
        background: "surface.actionSubtle.hover",
      },
    },
    _active: {
      "& [data-indicator]": {
        background: "surface.actionSubtle.hover.strong",
      },
    },
    _currentPage: {
      "& [data-indicator]": {
        background: "surface.actionSubtle.active",
      },
    },
    "& [data-link-text]": {
      textDecoration: "underline",
      _hover: {
        textDecoration: "none",
      },
    },
  },
});

const StyledNav = styled("nav", {
  base: {
    position: "relative",
  },
});

const Track = styled("div", {
  base: {
    position: "absolute",
    height: "100%",
    width: "1px",
    background: "stroke.default",
    left: "xsmall",
  },
});

const StepIndicatorWrapper = styled("div", {
  base: {
    minHeight: "xlarge",
    height: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "background.default",
    desktop: {
      background: "background.subtle",
    },
  },
});

const StepIndicator = styled("div", {
  base: {
    background: "background.default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "full",
    width: "medium",
    height: "medium",
    border: "1px solid",
    borderColor: "stroke.default",
    flexShrink: "0",
    transitionProperty: "background",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
    desktop: {
      background: "background.subtle",
    },
    "&[data-completed='true']": {
      background: "surface.brand.3.moderate",
    },
  },
});

const ListItem = styled("li", {
  base: {
    position: "relative",
    _last: {
      _after: {
        content: '""',
        background: "background.default",
        position: "absolute",
        bottom: "0",
        width: "100%",
        height: "50%",
        desktop: {
          background: "background.subtle",
        },
      },
    },
  },
});

const LEARNING_PATHS_STORAGE_KEY = "LEARNING_PATHS_COOKIES_KEY";

const LearningpathMenu = ({ resourcePath, learningpath, currentStep }: Props) => {
  const [viewedSteps, setViewedSteps] = useState<Record<string, boolean>>({});
  const { t } = useTranslation();

  const lastUpdatedDate = new Date(learningpath.lastUpdated);

  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${lastUpdatedDate.getMonth() + 1 < 10 ? "0" : ""}${
    lastUpdatedDate.getMonth() + 1
  }.${lastUpdatedDate.getFullYear()}`;

  const updateViewedSteps = () => {
    if (learningpath && currentStep?.seqNo !== undefined) {
      const storageKey = `${LEARNING_PATHS_STORAGE_KEY}_${learningpath.id}`;
      const currentViewedSteps = window.localStorage?.getItem(storageKey);
      const updatedViewedSteps = currentViewedSteps ? JSON.parse(currentViewedSteps) : {};
      setViewedSteps(updatedViewedSteps);
      updatedViewedSteps[currentStep.id] = true;
      window.localStorage?.setItem(storageKey, JSON.stringify(updatedViewedSteps));
    }
  };

  useEffect(() => {
    updateViewedSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep.id]);

  return (
    <>
      <StyledNav aria-label={t("learningpathPage.learningsteps")}>
        <Track />
        <StepperList>
          {learningpath.learningsteps.map((step, index) => (
            <ListItem key={step.id}>
              <StyledSafeLink
                to={toLearningPath(learningpath.id, step.id, resourcePath)}
                aria-current={index === currentStep.seqNo ? "page" : undefined}
                data-last={index === learningpath.learningsteps.length - 1}
                aria-label={`${step.title}${viewedSteps[step.id] ? `. ${t("learningpathPage.stepCompleted")}` : ""}`}
              >
                <StepIndicatorWrapper>
                  <StepIndicator data-indicator="" data-completed={!!viewedSteps[step.id]} aria-hidden>
                    {viewedSteps[step.id] && index !== currentStep.seqNo ? <CheckLine size="small" /> : index + 1}
                  </StepIndicator>
                </StepIndicatorWrapper>
                <span data-link-text="">{step.title}</span>
              </StyledSafeLink>
            </ListItem>
          ))}
        </StepperList>
      </StyledNav>
      <ArticleByline
        authors={learningpath.copyright.contributors}
        published={lastUpdatedString}
        bylineType="learningPath"
      />
    </>
  );
};

LearningpathMenu.fragments = {
  learningpath: gql`
    fragment LearningpathMenu_Learningpath on Learningpath {
      id
      title
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
      }
    }
  `,
  step: gql`
    fragment LearningpathMenu_LearningpathStep on LearningpathStep {
      id
      seqNo
    }
  `,
};

export default LearningpathMenu;
