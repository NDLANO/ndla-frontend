/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { TopicIntroductionList } from 'ndla-ui';
import { getSubtopicsWithIntroduction } from './topic';
import { injectT } from '../../i18n';
import { TopicShape } from '../../shapes';
import { toTopicPartial } from '../../routeHelpers';

const toTopic = (subjectId, topicPath) => {
  const topicIds = topicPath.map(topic => topic.id);
  return toTopicPartial(subjectId, ...topicIds);
};

export const TopicResources = ({ subtopics, subjectId, topicPath, t }) => {
  if (subtopics.length === 0) {
    return null;
  }
  return (
    <div>
      <h1 className="c-resources__title">{t('topicPage.topics')}</h1>
      <TopicIntroductionList
        toTopic={toTopic(subjectId, topicPath)}
        topics={subtopics}
      />
    </div>
  );
};

TopicResources.propTypes = {
  subjectId: PropTypes.string.isRequired,
  topicPath: PropTypes.arrayOf(TopicShape).isRequired,
  subtopics: PropTypes.arrayOf(TopicShape).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topic: { id: topicId } } = ownProps;
  return {
    subtopics: getSubtopicsWithIntroduction(subjectId, topicId)(state),
  };
};

export default compose(connect(mapStateToProps), injectT)(TopicResources);
