/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Tabs from 'ndla-tabs';
import { TopicIntroductionList, ResourceWrapper } from 'ndla-ui';
import { getSubtopicsWithIntroduction } from './topicSelectors';
import * as resourceActions from '../Resources/resourceActions';
import { injectT } from '../../i18n';
import { ResourceShape, TopicShape } from '../../shapes';
import Resources from '../Resources/Resources';
import { getResourcesByTopicId } from '../Resources/resourceSelectors';
import { toTopicPartial } from '../../routes';

const toTopic = (subjectId, topicPath) => {
  const topicIds = topicPath.map(topic => topic.id);
  return toTopicPartial(subjectId, ...topicIds);
};

function buildTabList(t, subtopics, resources, topicId, subjectId, topicPath) {
  const tabs = [];
  if (subtopics.length > 0) {
    tabs.push({
      title: t('topicPage.tabs.topics'),
      content: (<TopicIntroductionList toTopic={toTopic(subjectId, topicPath)} topics={subtopics} />
      ),
    });
  }
  if (resources.length > 0) {
    tabs.push({ title: t('topicPage.tabs.learningresources'), content: <Resources topicId={topicId} /> });
  }

  return tabs;
}


class TopicTabs extends Component {
  componentWillMount() {
    const { subjectId, topic: { id: topicId }, fetchTopicResources } = this.props;
    fetchTopicResources({ subjectId, topicId });
  }

  componentWillReceiveProps(nextProps) {
    const { topic, subjectId, fetchTopicResources } = this.props;
    if (nextProps.topic.id !== topic.id) {
      fetchTopicResources({ subjectId, topicId: nextProps.topic.id });
    }
  }

  render() {
    const { subtopics, topic: { id: topicId }, subjectId, resources, topicPath, t } = this.props;
    const tabs = buildTabList(t, subtopics, resources, topicId, subjectId, topicPath);
    if (tabs.length === 0) return null;
    return (
      <ResourceWrapper>
        <Tabs tabs={tabs} />
      </ResourceWrapper>
    );
  }
}

TopicTabs.propTypes = {
  subjectId: PropTypes.string.isRequired,
  fetchTopicResources: PropTypes.func.isRequired,
  topic: TopicShape.isRequired,
  topicPath: PropTypes.arrayOf(TopicShape).isRequired,
  subtopics: PropTypes.arrayOf(TopicShape).isRequired,
  resources: PropTypes.arrayOf(ResourceShape).isRequired,
};

const mapDispatchToProps = {
  fetchTopicResources: resourceActions.fetchTopicResources,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topic: { id: topicId } } = ownProps;
  return ({
    subtopics: getSubtopicsWithIntroduction(subjectId, topicId)(state),
    resources: getResourcesByTopicId(topicId)(state),
  });
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(TopicTabs);
