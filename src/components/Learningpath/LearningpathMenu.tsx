/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, colors, misc, mq, spacing, stackOrder } from "@ndla/core";
import { LearningPathRead } from "@ndla/icons/contentType";
import { SafeLink } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { ArticleByline, ContentTypeBadge, constants } from "@ndla/ui";
import config from "../../config";
import {
  GQLLearningpathMenu_LearningpathFragment,
  GQLLearningpathMenu_LearningpathStepFragment,
  GQLLearningpathMenu_ResourceFragment,
} from "../../graphqlTypes";
import { toLearningPath, useIsNdlaFilm } from "../../routeHelpers";
import { getContentType } from "../../util/getContentType";
import FavoriteButton from "../Article/FavoritesButton";
import AddResourceToFolderModal from "../MyNdla/AddResourceToFolderModal";

const { contentTypes } = constants;

interface Props {
  resource: GQLLearningpathMenu_ResourceFragment | undefined;
  learningpath: GQLLearningpathMenu_LearningpathFragment;
  currentStep: GQLLearningpathMenu_LearningpathStepFragment;
}

const HeaderWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

const StepperList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: 0;
  list-style: none;
`;

const StepperListItem = styled.li`
  padding: 0;
  margin: 0;
  padding-left: ${spacing.small};
  &:has([aria-current="page"]) {
    background-color: ${colors.white};
  }
`;

const StyledSafeLink = styled(SafeLink)`
  display: flex;
  align-items: flex-start;
  position: relative;
  gap: ${spacing.nsmall};
  color: ${colors.brand.primary};
  padding: ${spacing.small} 0px;
  box-shadow: none;
  &:hover,
  &:focus-within {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    &[data-inverted="true"]:not([aria-current="page"]) {
      color: ${colors.white};
    }
    &[data-inverted="true"][aria-current="page"] {
      color: ${colors.text.primary};
    }
  }

  &:not([data-last="true"]) {
    &::after {
      content: "";
      top: 50%;
      position: absolute;
      height: 100%;
      width: var(--width);
      background-color: var(--color);
      left: calc((${spacing.mediumlarge} / 2) - (var(--width) / 2));
      z-index: ${stackOrder.offsetSingle};
    }
  }
`;

const ContentTypeBadgeWrapper = styled.div`
  position: relative;
`;

const StyledContentTypeBadge = styled(ContentTypeBadge)`
  position: relative;
  min-width: ${spacing.mediumlarge};
  max-width: ${spacing.mediumlarge};
  min-height: ${spacing.mediumlarge};
  max-height: ${spacing.mediumlarge};
  z-index: ${stackOrder.offsetDouble};
`;

const StyledRead = styled(LearningPathRead)`
  position: absolute;
  z-index: ${stackOrder.offsetDouble};
  right: -${spacing.xsmall};
  top: -2px;
  background-color: ${colors.brand.secondary};
  color: ${colors.white};
  border-radius: ${misc.borderRadiusLarge};
  padding: 2px;
  min-width: ${spacing.nsmall};
  min-height: ${spacing.nsmall};
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  max-width: 300px;
  min-width: 300px;
  padding-top: ${spacing.normal};
  padding-right: ${spacing.small};
  ${mq.range({ from: breakpoints.desktop })} {
    &[data-inverted="true"] {
      color: ${colors.white};
    }
  }
`;

const LearningpathText = styled(Text)`
  color: ${colors.text.light};
  text-transform: uppercase;
  ${mq.range({ from: breakpoints.desktop })} {
    &[data-inverted="true"] {
      color: ${colors.white};
    }
  }
`;

const StyledText = styled(Text)`
  top: 50%;
  left: 150%;
`;

const getLineColor = (afterCurrent: boolean, inverted: boolean) => {
  if (inverted) {
    return afterCurrent ? colors.brand.greyLighter : colors.text.light;
  }
  return afterCurrent ? colors.brand.greyLighter : colors.text.primary;
};

const LEARNING_PATHS_STORAGE_KEY = "LEARNING_PATHS_COOKIES_KEY";

const getResourceType = (resource?: GQLLearningpathMenu_LearningpathFragment["learningsteps"][0]["resource"]) =>
  resource ? getContentType(resource) ?? contentTypes.LEARNING_PATH : contentTypes.LEARNING_PATH;

const LearningpathMenu = ({ resource, learningpath, currentStep }: Props) => {
  const [viewedSteps, setViewedSteps] = useState<Record<string, boolean>>({});
  const { t } = useTranslation();
  const headingId = useId();
  const ndlaFilm = useIsNdlaFilm();

  const lastUpdatedDate = new Date(learningpath.lastUpdated);

  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${lastUpdatedDate.getMonth() + 1 < 10 ? "0" : ""}${
    lastUpdatedDate.getMonth() + 1
  }.${lastUpdatedDate.getFullYear()}`;

  const updateViewedSteps = () => {
    if (learningpath && currentStep?.seqNo !== undefined) {
      const storageKey = `${LEARNING_PATHS_STORAGE_KEY}_${learningpath.id}`;
      const currentViewedSteps = window.localStorage.getItem(storageKey);
      const updatedViewedSteps = currentViewedSteps ? JSON.parse(currentViewedSteps) : {};
      setViewedSteps(updatedViewedSteps);
      updatedViewedSteps[currentStep.id] = true;
      window.localStorage.setItem(storageKey, JSON.stringify(updatedViewedSteps));
    }
  };

  useEffect(() => {
    updateViewedSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep.id]);

  return (
    <MenuWrapper data-inverted={ndlaFilm}>
      <LearningpathText margin="none" data-inverted={ndlaFilm} textStyle="meta-text-small">
        {t("learningPath.youAreInALearningPath")}
      </LearningpathText>
      <HeaderWrapper>
        <Heading element="h1" headingStyle="h4" margin="none" id={headingId}>
          {learningpath.title}
        </Heading>
        {!!resource?.path && config.feideEnabled && (
          <AddResourceToFolderModal
            resource={{
              id: learningpath.id.toString(),
              path: resource.path,
              resourceType: "learningpath",
            }}
          >
            <FavoriteButton path={resource.path} />
          </AddResourceToFolderModal>
        )}
      </HeaderWrapper>
      <nav aria-describedby={headingId}>
        <StepperList>
          {learningpath.learningsteps.map((step, index) => (
            <StepperListItem
              key={step.id}
              style={
                {
                  "--width": index >= currentStep.seqNo ? "2px" : "4px",
                  "--color": getLineColor(index >= currentStep.seqNo, ndlaFilm),
                } as CSSProperties
              }
            >
              <StyledSafeLink
                to={toLearningPath(learningpath.id, step.id, resource)}
                data-inverted={ndlaFilm}
                aria-current={index === currentStep.seqNo ? "page" : undefined}
                data-last={index === learningpath.learningsteps.length - 1}
              >
                <ContentTypeBadgeWrapper>
                  <StyledContentTypeBadge background type={getResourceType(step.resource)} />
                  {viewedSteps[step.id] && <StyledRead size="small" />}
                </ContentTypeBadgeWrapper>
                <StyledText element="span" margin="none" textStyle="meta-text-small">
                  {step.title}
                </StyledText>
              </StyledSafeLink>
            </StepperListItem>
          ))}
        </StepperList>
      </nav>
      <ArticleByline
        authors={learningpath.copyright.contributors}
        license={learningpath.copyright.license.license}
        published={lastUpdatedString}
        bylineType="learningPath"
      />
    </MenuWrapper>
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
        resource {
          id
          resourceTypes {
            id
            name
          }
        }
      }
    }
  `,
  step: gql`
    fragment LearningpathMenu_LearningpathStep on LearningpathStep {
      id
      seqNo
      showTitle
      title
      description
      license {
        license
      }
    }
  `,
  resource: gql`
    fragment LearningpathMenu_Resource on Resource {
      id
      path
    }
  `,
};

export default LearningpathMenu;
