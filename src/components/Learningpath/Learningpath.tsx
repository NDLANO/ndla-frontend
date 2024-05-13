/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing, spacingUnit } from "@ndla/core";
import { useWindowSize } from "@ndla/hooks";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { Heading, Text } from "@ndla/typography";
import {
  LearningPathMenu,
  LearningPathStickySibling,
  LearningPathStickyPlaceholder,
  LearningPathSticky,
  constants,
  HomeBreadcrumb,
  HeroContent,
  OneColumn,
  LicenseLink,
  LayoutItem,
  LearningPathBadge,
} from "@ndla/ui";
import LastLearningpathStepInfo from "./LastLearningpathStepInfo";
import LearningpathEmbed from "./LearningpathEmbed";
import config from "../../config";
import {
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpath_ResourceFragment,
  GQLLearningpath_ResourceTypeDefinitionFragment,
  GQLLearningpath_SubjectFragment,
  GQLLearningpath_TopicFragment,
} from "../../graphqlTypes";
import { Breadcrumb as BreadcrumbType } from "../../interfaces";
import { toLearningPath, useIsNdlaFilm } from "../../routeHelpers";
import { getContentType } from "../../util/getContentType";
import { TopicPath } from "../../util/getTopicPath";
import FavoriteButton from "../Article/FavoritesButton";
import AddResourceToFolderModal from "../MyNdla/AddResourceToFolderModal";

const LEARNING_PATHS_STORAGE_KEY = "LEARNING_PATHS_COOKIES_KEY";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  topic?: GQLLearningpath_TopicFragment;
  topicPath?: TopicPath[];
  resourceTypes?: GQLLearningpath_ResourceTypeDefinitionFragment[];
  subject?: GQLLearningpath_SubjectFragment;
  resource?: GQLLearningpath_ResourceFragment;
  skipToContentId?: string;
  breadcrumbItems: BreadcrumbType[];
}

const StyledHeroContent = styled(HeroContent)`
  display: none;

  ${mq.range({ from: breakpoints.tablet })} {
    display: flex;
  }
`;

const StyledLearningpathContent = styled.div`
  ${mq.range({ from: breakpoints.tablet })} {
    display: flex;
    border-top: 1px solid ${colors.brand.greyLight};
    margin-top: ${spacing.small};
    padding-top: ${spacing.nsmall}px;
  }
`;

const StyledOneColumn = styled(OneColumn)`
  ${mq.range({ from: breakpoints.tablet })} {
    &[data-inverted="true"] {
      color: ${colors.white};
    }
  }
`;

const StepInfoText = styled(Text)`
  white-space: nowrap;
  ${mq.range({ from: breakpoints.tablet })} {
    display: none;
  }
`;

const MobileHeaderWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  background: ${colors.brand.lighter};
  margin: 0 -${spacing.normal} ${spacing.medium};
  padding: ${spacing.small} ${spacing.normal};
`;

const LearningPathWrapper = styled.section`
  max-width: ${1402 + spacingUnit}px;
  padding: 0 ${spacing.normal};
  margin: 0 auto;

  &[data-inverted="true"] {
    ${mq.range({ until: breakpoints.tablet })} {
      background: #fff;
    }
  }
`;

const Learningpath = ({
  learningpath,
  learningpathStep,
  resource,
  topic,
  subject,
  topicPath,
  resourceTypes,
  skipToContentId,
  breadcrumbItems,
}: Props) => {
  const { t, i18n } = useTranslation();
  const ndlaFilm = useIsNdlaFilm();
  const { id, learningsteps, lastUpdated, copyright, title } = learningpath;

  const lastUpdatedDate = new Date(lastUpdated);

  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${lastUpdatedDate.getMonth() + 1 < 10 ? "0" : ""}${
    lastUpdatedDate.getMonth() + 1
  }.${lastUpdatedDate.getFullYear()}`;

  const { contentTypes } = constants;

  const mappedLearningsteps = learningsteps.map((step) => {
    const type = step.resource ? getContentType(step.resource) : undefined;
    return {
      ...step,
      type: type ?? contentTypes.LEARNING_PATH,
    };
  });

  const storageKey = `${LEARNING_PATHS_STORAGE_KEY}_${id}`;

  const [viewedSteps, setViewedSteps] = useState({});

  const updateViewedSteps = () => {
    if (learningpath && learningpathStep && learningpathStep.seqNo !== undefined) {
      const currentViewedSteps = window.localStorage.getItem(storageKey);
      const updatedViewedSteps = currentViewedSteps ? JSON.parse(currentViewedSteps) : {};
      setViewedSteps(updatedViewedSteps);
      updatedViewedSteps[learningpathStep.id] = true;
      window.localStorage.setItem(storageKey, JSON.stringify(updatedViewedSteps));
    }
  };

  useEffect(() => updateViewedSteps(), [learningpathStep.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const { innerWidth } = useWindowSize(100);
  const mobileView = innerWidth < 601;
  const learningPathMenu = (
    <LearningPathMenu
      invertedStyle={ndlaFilm}
      learningPathId={id}
      learningsteps={mappedLearningsteps}
      toLearningPathUrl={(pathId, stepId) => toLearningPath(pathId, stepId, resource)}
      lastUpdated={lastUpdatedString}
      copyright={copyright}
      currentIndex={learningpathStep.seqNo}
      name={title}
      cookies={viewedSteps}
      learningPathURL={config.learningPathDomain}
      heartButton={
        resource?.path &&
        config.feideEnabled && (
          <AddResourceToFolderModal
            resource={{
              id: learningpath.id.toString(),
              path: resource.path,
              resourceType: "learningpath",
            }}
          >
            <FavoriteButton path={resource.path} />
          </AddResourceToFolderModal>
        )
      }
    />
  );

  const previousStep = learningsteps[learningpathStep.seqNo - 1];
  const nextStep = learningsteps[learningpathStep.seqNo + 1];

  return (
    <LearningPathWrapper data-inverted={ndlaFilm}>
      <StyledHeroContent>
        <section>
          <HomeBreadcrumb light={ndlaFilm} items={breadcrumbItems} />
        </section>
      </StyledHeroContent>
      <StyledLearningpathContent>
        {mobileView ? (
          <MobileHeaderWrapper>
            <LearningPathBadge size="xx-small" background />
            <Text margin="none" textStyle="meta-text-small">
              {t("learningPath.youAreInALearningPath")}
            </Text>
          </MobileHeaderWrapper>
        ) : (
          learningPathMenu
        )}
        {learningpathStep && (
          <div data-testid="learningpath-content">
            {learningpathStep.showTitle && (
              <StyledOneColumn data-inverted={ndlaFilm}>
                <LayoutItem layout="center">
                  <Heading element="h1" headingStyle="h1-resource" margin="large" id={skipToContentId}>
                    {learningpathStep.title}
                  </Heading>
                  <LicenseLink
                    license={getLicenseByAbbreviation(learningpathStep.license?.license ?? "", i18n.language)}
                  />
                  {!!learningpathStep.description && <div>{parse(learningpathStep.description)}</div>}
                </LayoutItem>
              </StyledOneColumn>
            )}
            <LearningpathEmbed
              skipToContentId={!learningpathStep.showTitle ? skipToContentId : undefined}
              topic={topic}
              subjectId={subject?.id}
              learningpathStep={learningpathStep}
              breadcrumbItems={breadcrumbItems}
            />
            <LastLearningpathStepInfo
              topic={topic}
              topicPath={topicPath}
              resourceTypes={resourceTypes}
              seqNo={learningpathStep.seqNo}
              numberOfLearningSteps={learningsteps.length - 1}
              title={title}
              subject={subject}
            />
          </div>
        )}
      </StyledLearningpathContent>
      <LearningPathSticky>
        {mobileView && learningPathMenu}
        {previousStep ? (
          <LearningPathStickySibling
            arrow="left"
            pathId={learningpath.id}
            stepId={previousStep.id}
            toLearningPathUrl={(pathId, stepId) => toLearningPath(pathId, stepId, resource)}
            title={previousStep.title}
          />
        ) : (
          <LearningPathStickyPlaceholder />
        )}
        <StepInfoText textStyle="meta-text-small" margin="none">
          {t("learningPath.mobileStepInfo", {
            totalPages: learningsteps.length,
            currentPage: learningpathStep.seqNo + 1,
          })}
        </StepInfoText>
        {nextStep ? (
          <LearningPathStickySibling
            arrow="right"
            pathId={learningpath.id}
            stepId={nextStep.id}
            toLearningPathUrl={(pathId, stepId) => toLearningPath(pathId, stepId, resource)}
            title={nextStep.title}
          />
        ) : (
          <LearningPathStickyPlaceholder />
        )}
      </LearningPathSticky>
    </LearningPathWrapper>
  );
};

Learningpath.fragments = {
  topic: gql`
    fragment Learningpath_Topic on Topic {
      ...LastLearningpathStepInfo_Topic
      ...LearningpathEmbed_Topic
    }
    ${LearningpathEmbed.fragments.topic}
    ${LastLearningpathStepInfo.fragments.topic}
  `,
  resourceType: gql`
    fragment Learningpath_ResourceTypeDefinition on ResourceTypeDefinition {
      ...LastLearningpathStepInfo_ResourceTypeDefinition
    }
    ${LastLearningpathStepInfo.fragments.resourceType}
  `,
  subject: gql`
    fragment Learningpath_Subject on Subject {
      id
      ...LastLearningpathStepInfo_Subject
    }
    ${LastLearningpathStepInfo.fragments.subject}
  `,
  learningpathStep: gql`
    fragment Learningpath_LearningpathStep on LearningpathStep {
      seqNo
      id
      showTitle
      title
      description
      license {
        license
      }
      ...LearningpathEmbed_LearningpathStep
    }
    ${LearningpathEmbed.fragments.learningpathStep}
  `,
  resource: gql`
    fragment Learningpath_Resource on Resource {
      path
    }
  `,
  learningpath: gql`
    fragment Learningpath_Learningpath on Learningpath {
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
        title
        resource {
          id
          resourceTypes {
            id
            name
          }
        }
        id
      }
    }
  `,
};

export default Learningpath;
