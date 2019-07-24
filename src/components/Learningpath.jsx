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

const Learningpath = ({ learningpath, currentLearningStepNumber, t }) => {
  const {
    learningsteps,
    duration,
    lastUpdated,
    copyright,
    title,
  } = learningpath;

  const lastUpdatedDate = new Date(lastUpdated);
  const stepId = learningsteps[currentLearningStepNumber].id;
  const currentLearningStep = learningsteps[currentLearningStepNumber];
  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${
    lastUpdatedDate.getMonth() < 10 ? '0' : ''
  }${lastUpdatedDate.getMonth()}.${lastUpdatedDate.getFullYear()}`;
  const isLastStep = currentLearningStepNumber === learningsteps.length - 1;

  return (
    <LearningPathWrapper>
      <div className="c-hero__content">
        <section></section>
      </div>
      <LearningPathContent>
        <LearningPathMenu
          learningsteps={learningsteps}
          duration={duration}
          lastUpdated={lastUpdatedString}
          copyright={copyright}
          stepId={stepId}
          currentIndex={currentLearningStepNumber}
          name={title.title}
          cookies={false}
          learningPathURL="https://stier.ndla.no"
        />
        {currentLearningStep && (
          <div>
            {currentLearningStep.showTitle && (
              <LearningPathInformation
                title={currentLearningStep.title.title}
                description={
                  currentLearningStep.description &&
                  currentLearningStep.description.description
                }
                license={currentLearningStep.license}
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
            label={t('learningPath.previousArrow')}
            to={learningsteps[currentLearningStepNumber - 1].metaUrl}
            title={learningsteps[currentLearningStepNumber - 1].title.title}
          />
        ) : (
          <div />
        )}
        {currentLearningStepNumber < learningsteps.length - 1 && (
          <LearningPathStickySibling
            arrow="right"
            label={t('learningPath.nextArrow')}
            to={learningsteps[currentLearningStepNumber + 1].metaUrl}
            title={learningsteps[currentLearningStepNumber + 1].title.title}
          />
        )}
      </LearningPathSticky>
    </LearningPathWrapper>
  );
};

Learningpath.defaultProps = {
  currentLearningStepNumber: 0,
};

Learningpath.propTypes = {
  learningpath: PropTypes.object,
  currentLearningStepNumber: PropTypes.number,
};

export default injectT(Learningpath);
