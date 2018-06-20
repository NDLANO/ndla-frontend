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
import {
  ResourcesWrapper,
  ResourcesTitle,
  TopicIntroductionList,
} from 'ndla-ui';
import { withRouter } from 'react-router-dom';
import { injectT } from 'ndla-i18n';
import { getSubtopicsWithIntroduction } from './topic';
import { TopicShape, LocationShape } from '../../shapes';
import { toTopicPartial } from '../../routeHelpers';
import { getFiltersFromUrl } from '../../util/filterHelper';

const toTopic = (subjectId, topicPath, filters) => {
  const topicIds = topicPath.map(topic => topic.id);
  return toTopicPartial(subjectId, filters, ...topicIds);
};

export const TopicResources = ({
  subtopics,
  subjectId,
  topicPath,
  location,
  t,
}) => {
  if (subtopics.length === 0) {
    return null;
  }

  return (
    <ResourcesWrapper>
      <ResourcesTitle>{t('topicPage.topics')}</ResourcesTitle>
      <TopicIntroductionList
        toTopic={toTopic(subjectId, topicPath, getFiltersFromUrl(location))}
        topics={subtopics}
      />
    </ResourcesWrapper>
  );
};

TopicResources.propTypes = {
  subjectId: PropTypes.string.isRequired,
  topicPath: PropTypes.arrayOf(TopicShape).isRequired,
  subtopics: PropTypes.arrayOf(TopicShape).isRequired,
  location: LocationShape,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topic: { id: topicId } } = ownProps;
  return {
    subtopics: getSubtopicsWithIntroduction(subjectId, topicId)(state),
  };
};

export default compose(withRouter, connect(mapStateToProps), injectT)(
  TopicResources,
);
