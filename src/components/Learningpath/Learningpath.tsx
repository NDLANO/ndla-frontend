/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useWindowSize } from '@ndla/hooks';
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
} from '@ndla/ui';
import { toLearningPath, useIsNdlaFilm } from '../../routeHelpers';
import LastLearningpathStepInfo from './LastLearningpathStepInfo';
import LearningpathEmbed from './LearningpathEmbed';
import config from '../../config';
import { getContentType } from '../../util/getContentType';
import { Breadcrumb as BreadcrumbType } from '../../interfaces';
import {
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpath_ResourceFragment,
  GQLLearningpath_ResourceTypeDefinitionFragment,
  GQLLearningpath_SubjectFragment,
  GQLLearningpath_TopicFragment,
  GQLLearningpath_TopicPathFragment,
} from '../../graphqlTypes';
import AddResourceToFolderModal from '../MyNdla/AddResourceToFolderModal';
import FavoriteButton from '../Article/FavoritesButton';

const LEARNING_PATHS_STORAGE_KEY = 'LEARNING_PATHS_COOKIES_KEY';

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  topic?: GQLLearningpath_TopicFragment;
  topicPath?: GQLLearningpath_TopicPathFragment[];
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
  const [isAdding, setIsAdding] = useState(false);
  const ndlaFilm = useIsNdlaFilm();
  const { id, learningsteps, lastUpdated, copyright, title } = learningpath;

  const lastUpdatedDate = new Date(lastUpdated);

  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${
    lastUpdatedDate.getMonth() + 1 < 10 ? '0' : ''
  }${lastUpdatedDate.getMonth() + 1}.${lastUpdatedDate.getFullYear()}`;

  const { contentTypes } = constants;

  const mappedLearningsteps = learningsteps.map(step => {
    const type = step.resource ? getContentType(step.resource) : undefined;
    return {
      ...step,
      type: type ?? contentTypes.LEARNING_PATH,
    };
  });

  const storageKey = `${LEARNING_PATHS_STORAGE_KEY}_${id}`;

  const [viewedSteps, setViewedSteps] = useState({});

  const updateViewedSteps = () => {
    if (
      learningpath &&
      learningpathStep &&
      learningpathStep.seqNo !== undefined
    ) {
      const currentViewedSteps = window.localStorage.getItem(storageKey);
      const updatedViewedSteps = currentViewedSteps
        ? JSON.parse(currentViewedSteps)
        : {};
      setViewedSteps(updatedViewedSteps);
      updatedViewedSteps[learningpathStep.id] = true;
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(updatedViewedSteps),
      );
    }
  };

  useEffect(() => updateViewedSteps(), [learningpathStep.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    window.addEventListener('keyup', onKeyUpEvent);
    updateViewedSteps();
    return () => {
      window.removeEventListener('keyup', onKeyUpEvent);
    };
  }, [onKeyUpEvent]); // eslint-disable-line react-hooks/exhaustive-deps

  const { innerWidth } = useWindowSize(100);
  const mobileView = innerWidth < 601;
  const learningPathMenu = (
    <LearningPathMenu
      invertedStyle={ndlaFilm}
      learningPathId={id}
      learningsteps={mappedLearningsteps}
      toLearningPathUrl={(pathId, stepId) =>
        toLearningPath(pathId, stepId, resource)
      }
      lastUpdated={lastUpdatedString}
      copyright={copyright}
      currentIndex={learningpathStep.seqNo}
      name={title}
      cookies={viewedSteps}
      learningPathURL={config.learningPathDomain}
      heartButton={
        resource?.path &&
        config.feideEnabled && (
          <FavoriteButton
            path={resource.path}
            onClick={() => setIsAdding(true)}
          />
        )
      }
    />
  );

  const previousStep = learningsteps[learningpathStep.seqNo - 1];
  const nextStep = learningsteps[learningpathStep.seqNo + 1];

  return (
    <LearningPathWrapper invertedStyle={ndlaFilm}>
      <div className="c-hero__content">
        <section>
          <HomeBreadcrumb light={ndlaFilm} items={breadcrumbItems} />
        </section>
      </div>
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
              skipToContentId={
                !learningpathStep.showTitle ? skipToContentId : undefined
              }
              topic={topic}
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
            toLearningPathUrl={(pathId, stepId) =>
              toLearningPath(pathId, stepId, resource)
            }
            title={previousStep.title}
          />
        ) : (
          <LearningPathStickyPlaceholder />
        )}
        <LearningPathMobileStepInfo
          total={learningsteps.length}
          current={learningpathStep.seqNo + 1}
        />
        {nextStep ? (
          <LearningPathStickySibling
            arrow="right"
            pathId={learningpath.id}
            stepId={nextStep.id}
            toLearningPathUrl={(pathId, stepId) =>
              toLearningPath(pathId, stepId, resource)
            }
            title={nextStep.title}
          />
        ) : (
          <LearningPathStickyPlaceholder />
        )}
      </LearningPathSticky>
      {resource?.path && (
        <AddResourceToFolderModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          resource={{
            id: learningpath.id,
            path: resource.path,
            resourceType: 'learningpath',
          }}
        />
      )}
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
  topicPath: gql`
    fragment Learningpath_TopicPath on Topic {
      ...LastLearningpathStepInfo_TopicPath
    }
    ${LastLearningpathStepInfo.fragments.topicPath}
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
