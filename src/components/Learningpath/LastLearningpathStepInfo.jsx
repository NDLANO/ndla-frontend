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
  filters,
}) => {
  const isLastStep = seqNo === numberOfLearningSteps;
  const filterParams = filters.length > 0 ? `?filters=${filters}` : '';

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
          url: `${toSubjects()}${subject.path}${filterParams}`,
          name: subject.name,
        }
      }
      topic={
        topicWithPath && {
          url: `${toSubjects()}${topicWithPath.path}${filterParams}`,
          name: topicWithPath.name,
        }
      }>
      {showResources && (
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
  filters: PropTypes.arrayOf(PropTypes.string),
};

export default LastLearningpathStepInfo;
