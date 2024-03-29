/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, mq } from "@ndla/core";
import { useWindowSize } from "@ndla/hooks";
import {
  LearningPathWrapper,
  LearningPathMenu,
  LearningPathContent,
  LearningPathInformation,
  LearningPathStickySibling,
  LearningPathMobileStepInfo,
  LearningPathStickyPlaceholder,
  LearningPathSticky,
  LearningPathMobileHeader,
  constants,
  HomeBreadcrumb,
  HeroContent,
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
  onKeyUpEvent: (evt: KeyboardEvent) => void;
  breadcrumbItems: BreadcrumbType[];
}

const Learningpath = ({
  learningpath,
  learningpathStep,
  resource,
  topic,
  subject,
  topicPath,
  resourceTypes,
  skipToContentId,
  onKeyUpEvent,
  breadcrumbItems,
}: Props) => {
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
  useEffect(() => {
    window.addEventListener("keyup", onKeyUpEvent);
    updateViewedSteps();
    return () => {
      window.removeEventListener("keyup", onKeyUpEvent);
    };
  }, [onKeyUpEvent]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const StyledHeroContent = styled(HeroContent)`
    display: none;

    ${mq.range({ from: breakpoints.tablet })} {
      display: flex;
    }
  `;

  const previousStep = learningsteps[learningpathStep.seqNo - 1];
  const nextStep = learningsteps[learningpathStep.seqNo + 1];

  return (
    <LearningPathWrapper invertedStyle={ndlaFilm}>
      <StyledHeroContent>
        <section>
          <HomeBreadcrumb light={ndlaFilm} items={breadcrumbItems} />
        </section>
      </StyledHeroContent>
      <LearningPathContent>
        {mobileView ? <LearningPathMobileHeader /> : learningPathMenu}
        {learningpathStep && (
          <div data-testid="learningpath-content">
            {learningpathStep.showTitle && (
              <LearningPathInformation
                id={skipToContentId}
                invertedStyle={ndlaFilm}
                title={learningpathStep.title}
                description={learningpathStep.description}
                license={learningpathStep.license}
              />
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
      </LearningPathContent>
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
        <LearningPathMobileStepInfo total={learningsteps.length} current={learningpathStep.seqNo + 1} />
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
