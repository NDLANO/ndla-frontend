/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
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
import { useTranslation } from 'react-i18next';
import { toLearningPath } from '../../routeHelpers';
import LastLearningpathStepInfo from './LastLearningpathStepInfo';
import {
  BreadCrumbShape,
  LearningpathShape,
  LearningpathStepShape,
  LocationShape,
  ResourceShape,
  ResourceTypeShape,
  SubjectShape,
  TopicShape,
} from '../../shapes';
import LearningpathEmbed from './LearningpathEmbed';
import config from '../../config';
import { getContentType } from '../../util/getContentType';

const LEARNING_PATHS_STORAGE_KEY = 'LEARNING_PATHS_COOKIES_KEY';

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
  location,
  history,
  onKeyUpEvent,
  ndlaFilm,
  breadcrumbItems,
}) => {
  const {
    id,
    learningsteps,
    duration,
    lastUpdated,
    copyright,
    title,
  } = learningpath;

  const { t } = useTranslation();

  const lastUpdatedDate = new Date(lastUpdated);
  const stepId = learningpathStep.id;

  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${
    lastUpdatedDate.getMonth() < 10 ? '0' : ''
  }${lastUpdatedDate.getMonth()}.${lastUpdatedDate.getFullYear()}`;

  const { contentTypes } = constants;

  const mappedLearningsteps = learningsteps.map(step => {
    const type = step.resource
      ? getContentType(step.resource)
      : contentTypes.LEARNING_PATH;
    return {
      ...step,
      type: type,
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
      duration={duration}
      toLearningPathUrl={(pathId, stepId) =>
        toLearningPath(pathId, stepId, resource)
      }
      lastUpdated={lastUpdatedString}
      copyright={copyright}
      stepId={stepId}
      currentIndex={learningpathStep.seqNo}
      name={title}
      cookies={viewedSteps}
      learningPathURL={config.learningPathDomain}
    />
  );

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
        {learningpathStep.seqNo > 0 ? (
          <LearningPathStickySibling
            arrow="left"
            pathId={learningpath.id}
            stepId={learningsteps[learningpathStep.seqNo - 1].id}
            toLearningPathUrl={(pathId, stepId) =>
              toLearningPath(pathId, stepId, resource)
            }
            label={t('learningPath.previousArrow')}
            title={learningsteps[learningpathStep.seqNo - 1].title}
          />
        ) : (
          <LearningPathStickyPlaceholder />
        )}
        <LearningPathMobileStepInfo
          total={learningsteps.length}
          current={learningpathStep.seqNo + 1}
        />
        {learningpathStep.seqNo < learningsteps.length - 1 ? (
          <LearningPathStickySibling
            arrow="right"
            label={t('learningPath.nextArrow')}
            pathId={learningpath.id}
            stepId={learningsteps[learningpathStep.seqNo + 1].id}
            toLearningPathUrl={(pathId, stepId) =>
              toLearningPath(pathId, stepId, resource)
            }
            title={learningsteps[learningpathStep.seqNo + 1].title}
          />
        ) : (
          <LearningPathStickyPlaceholder />
        )}
      </LearningPathSticky>
    </LearningPathWrapper>
  );
};

Learningpath.propTypes = {
  learningpath: LearningpathShape,
  learningpathStep: LearningpathStepShape,
  topic: TopicShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  subject: SubjectShape,
  resource: ResourceShape,
  skipToContentId: PropTypes.string,
  locale: PropTypes.string.isRequired,
  location: LocationShape,
  ndlaFilm: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onKeyUpEvent: func.isRequired,
  breadcrumbItems: PropTypes.arrayOf(BreadCrumbShape),
};

export default withRouter(Learningpath);
