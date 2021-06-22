/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { LearningPathLastStepNavigation } from '@ndla/ui';
import Resources from '../../containers/Resources/Resources';
import { TopicShape, SubjectShape, ResourceTypeShape } from '../../shapes';

const LastLearningpathStepInfo = ({
  topic,
  subject,
  topicPath,
  resourceTypes,
  seqNo,
  numberOfLearningSteps,
  title,
  ndlaFilm,
}) => {
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep) {
    return null;
  }
  const topicWithPath =
    topicPath && topic
      ? topicPath.find(path => path.id === topic.id)
      : undefined;

  const showResources =
    topic &&
    resourceTypes &&
    ((topic.coreResources && topic.coreResources.length > 0) ||
      (topic.supplementaryResources &&
        topic.supplementaryResources.length > 0));

  return (
    <LearningPathLastStepNavigation
      learningPathName={title}
      subject={
        subject && {
          url: subject.path,
          name: subject.name,
        }
      }
      topic={
        topicWithPath && {
          url: topicWithPath.path,
          name: topicWithPath.name,
        }
      }>
      {showResources && (
        <Resources
          key="resources"
          resourceTypes={resourceTypes}
          topic={topic}
          ndlaFilm={ndlaFilm}
          {...topic}
        />
      )}
    </LearningPathLastStepNavigation>
  );
};

LastLearningpathStepInfo.propTypes = {
  topic: TopicShape,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  seqNo: PropTypes.number.isRequired,
  numberOfLearningSteps: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  ndlaFilm: PropTypes.bool,
};

export default LastLearningpathStepInfo;
