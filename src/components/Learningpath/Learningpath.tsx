/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { useWindowSize } from '@ndla/hooks';
import {
  LearningPathWrapper,
  LearningPathMenu,
  LearningPathContent,
  LearningPathInformation,
  LearningPathStickySibling,
  LearningPathMobileStepInfo,
  LearningPathStickyPlaceholder,
  Breadcrumb,
  LearningPathSticky,
  LearningPathMobileHeader,
  constants,
} from '@ndla/ui';
import { toLearningPath } from '../../routeHelpers';
import LastLearningpathStepInfo from './LastLearningpathStepInfo';
import LearningpathEmbed from './LearningpathEmbed';
import config from '../../config';
import { getContentType } from '../../util/getContentType';
import { Breadcrumb as BreadcrumbType, LocaleType } from '../../interfaces';
import {
  GQLLearningpathInfoFragment,
  GQLResourcePageQuery,
  GQLSubjectInfoFragment,
  GQLTopic,
} from '../../graphqlTypes';

const LEARNING_PATHS_STORAGE_KEY = 'LEARNING_PATHS_COOKIES_KEY';

interface Props {
  learningpath: GQLLearningpathInfoFragment;
  learningpathStep: GQLLearningpathInfoFragment['learningsteps'][0];
  topic?: Required<GQLResourcePageQuery>['topic'];
  topicPath?: Omit<GQLTopic, 'paths' | 'metadata'>[];
  resourceTypes?: Required<GQLResourcePageQuery>['resourceTypes'];
  subject?: Omit<GQLSubjectInfoFragment, 'metadata'>;
  resource?: Required<GQLResourcePageQuery>['resource'];
  skipToContentId?: string;
  locale: LocaleType;
  ndlaFilm: boolean;
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
  locale,
  onKeyUpEvent,
  ndlaFilm,
  breadcrumbItems,
}: Props) => {
  const { id, learningsteps, lastUpdated, copyright, title } = learningpath;

  const lastUpdatedDate = new Date(lastUpdated);

  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${
    lastUpdatedDate.getMonth() < 10 ? '0' : ''
  }${lastUpdatedDate.getMonth()}.${lastUpdatedDate.getFullYear()}`;

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
    />
  );

  const previousStep = learningsteps[learningpathStep.seqNo - 1];
  const nextStep = learningsteps[learningpathStep.seqNo + 1];

  return (
    <LearningPathWrapper invertedStyle={ndlaFilm}>
      <div className="c-hero__content">
        <section>
          <Breadcrumb invertedStyle={ndlaFilm} items={breadcrumbItems} />
        </section>
      </div>
      <LearningPathContent>
        {mobileView ? <LearningPathMobileHeader /> : learningPathMenu}
        {learningpathStep && (
          <div data-testid="learningpath-content">
            {learningpathStep.showTitle && (
              <LearningPathInformation
                invertedStyle={ndlaFilm}
                title={learningpathStep.title}
                description={learningpathStep.description}
                license={learningpathStep.license}
              />
            )}
            <LearningpathEmbed
              skipToContentId={skipToContentId}
              locale={locale}
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
              ndlaFilm={ndlaFilm}
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
    </LearningPathWrapper>
  );
};

export default Learningpath;
