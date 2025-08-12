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
import { CheckLine } from "@ndla/icons";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleByline } from "@ndla/ui";
import { LearningpathContext } from "./learningpathUtils";
import config from "../../config";
import { GQLLearningpathMenu_LearningpathFragment } from "../../graphqlTypes";
import { routes, toLearningPath } from "../../routeHelpers";
import formatDate from "../../util/formatDate";

interface Props {
  resourcePath: string | undefined;
  learningpath: GQLLearningpathMenu_LearningpathFragment;
  currentIndex: number;
  context?: LearningpathContext;
}

const StepperList = styled("ol", {
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
  },
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
    "&[data-completed='true']": {
      background: "surface.brand.3.moderate",
    },
  },
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
      },
    },
  },
  variants: {
    context: {
      default: {
        _last: {
          _after: {
            desktop: {
              background: "background.subtle",
            },
          },
        },
      },
      preview: {},
    },
  },
});

const LEARNING_PATHS_STORAGE_KEY = "LEARNING_PATHS_COOKIES_KEY";

const LearningpathMenu = ({ resourcePath, learningpath, currentIndex, context }: Props) => {
  const [viewedSteps, setViewedSteps] = useState<Record<string, boolean>>({});
  const { t, i18n } = useTranslation();

  const currentStep = learningpath.learningsteps[currentIndex];
  const lastUpdated = formatDate(learningpath.lastUpdated, i18n.language);

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
  }, [currentStep?.id]);

  return (
    <>
      <StyledNav aria-label={t("learningpathPage.learningsteps")}>
        <Track />
        <StepperList>
          {learningpath.learningsteps.map((step, index) => (
            <ListItem key={step.id} context={context}>
              <StyledSafeLink
                to={
                  context === "preview"
                    ? routes.myNdla.learningpathPreview(learningpath.id, step.id)
                    : toLearningPath(learningpath.id, step.id, resourcePath)
                }
                aria-current={index === currentIndex ? "page" : undefined}
                data-last={index === learningpath.learningsteps.length - 1}
                aria-label={`${step.title}${viewedSteps[step.id] ? `. ${t("learningpathPage.stepCompleted")}` : ""}`}
              >
                <StepIndicatorWrapper context={context}>
                  <StepIndicator
                    data-indicator=""
                    data-completed={!!viewedSteps[step.id]}
                    aria-hidden
                    context={context}
                  >
                    {viewedSteps[step.id] && index !== currentIndex ? <CheckLine size="small" /> : index + 1}
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

export default LearningpathMenu;
