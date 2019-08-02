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
import { toSubjects } from '../../routeHelpers';
import { TopicShape, SubjectShape, ResourceTypeShape } from '../../shapes';

const LastLearningpathStepInfo = ({
  topic,
  subject,
  topicPath,
  resourceTypes,
  seqNo,
  numberOfLearningSteps,
  title,
}) => {
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep) {
    return null;
  }

  const topicWithPath =
    topicPath && topic
      ? topicPath.find(path => path.id === topic.id)
      : undefined;

  return (
    <LearningPathLastStepNavigation
      learningPathName={title}
      subject={
        subject && { url: toSubjects() + subject.path, name: subject.name }
      }
      topic={
        topicWithPath && {
          url: toSubjects() + topicWithPath.path,
          name: topicWithPath.name,
        }
      }>
      {topic && resourceTypes && (
        <Resources
          key="resources"
          resourceTypes={resourceTypes}
          title={topic.title}
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
};

export default LastLearningpathStepInfo;
