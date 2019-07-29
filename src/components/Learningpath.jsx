import React, { useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import {
  LearningPathWrapper,
  LearningPathMenu,
  LearningPathContent,
  LearningPathInformation,
  LearningPathLastStepNavigation,
  LearningPathSticky,
  LearningPathStickySibling,
} from '@ndla/ui';
import Resources from '../containers/Resources/Resources';
import { toLocalLearningPath } from '../routeHelpers';

const Learningpath = ({ learningpath, learningpathStep, t }) => {
  const {
    id,
    learningsteps,
    duration,
    lastUpdated,
    copyright,
    title,
  } = learningpath;

  const lastUpdatedDate = new Date(lastUpdated);
  const stepId = learningpathStep.id;
  const currentLearningStepNumber = learningsteps.find(
    step => step.seqNo === learningpathStep.seqNo,
  ).seqNo;
  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${
    lastUpdatedDate.getMonth() < 10 ? '0' : ''
  }${lastUpdatedDate.getMonth()}.${lastUpdatedDate.getFullYear()}`;
  const isLastStep = currentLearningStepNumber === learningsteps.length - 1;
  console.log(learningpathStep);
  return (
    <LearningPathWrapper>
      <div className="c-hero__content">
        <section></section>
      </div>
      <LearningPathContent>
        <LearningPathMenu
          learningPathId={id}
          learningsteps={learningsteps}
          duration={duration}
          toLearningPathUrl={toLocalLearningPath}
          lastUpdated={lastUpdatedString}
          copyright={copyright}
          stepId={stepId}
          currentIndex={currentLearningStepNumber}
          name={title.title}
          cookies={false}
          learningPathURL="https://stier.ndla.no"
        />
        {learningpathStep && (
          <div>
            {learningpathStep.showTitle && (
              <LearningPathInformation
                title={learningpathStep.title}
                description={learningpathStep.description}
                license={learningpathStep.license}
              />
            )}

            {isLastStep && (
              <LearningPathLastStepNavigation
                learningPathName={title.title}
                subject={{ url: '#', name: 'Samfunnsfag' }}
                topic={{ url: '#', name: 'Eksempel på fag' }}>
                <Resources key="resources" />
              </LearningPathLastStepNavigation>
            )}
          </div>
        )}
      </LearningPathContent>
      <LearningPathSticky>
        {currentLearningStepNumber > 0 ? (
          <LearningPathStickySibling
            arrow="left"
            pathId={learningpath.id}
            stepId={learningsteps[currentLearningStepNumber - 1].id}
            toLearningPathUrl={toLocalLearningPath}
            label={t('learningPath.previousArrow')}
            title={learningsteps[currentLearningStepNumber - 1].title}
          />
        ) : (
          <div />
        )}
        {currentLearningStepNumber < learningsteps.length - 1 && (
          <LearningPathStickySibling
            arrow="right"
            label={t('learningPath.nextArrow')}
            pathId={learningpath.id}
            stepId={learningsteps[currentLearningStepNumber + 1].id}
            toLearningPathUrl={toLocalLearningPath}
            title={learningsteps[currentLearningStepNumber + 1].title}
          />
        )}
      </LearningPathSticky>
    </LearningPathWrapper>
  );
};

Learningpath.propTypes = {
  learningpath: PropTypes.object, //TODO: fix,
  learningpathStep: PropTypes.object,
};

export default injectT(Learningpath);
