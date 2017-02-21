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
import { TopicIntroductionList } from 'ndla-ui';
import { getSubtopicsWithIntroduction } from './topicSelectors';
import * as actions from './topicActions';
import { injectT } from '../../i18n';
import { TopicShape } from '../../shapes';
import Resources from '../Resources/Resources';
import { toTopic } from '../../routes';


function buildTabList(t, subtopics, subjectId) {
  const tabs = [];

  tabs.push({ key: 'topics', displayName: t('topicPage.tabs.topics'), content: <TopicIntroductionList subjectId={subjectId} toTopic={toTopic} topics={subtopics} /> });
  tabs.push({ key: 'learningresources', displayName: t('topicPage.tabs.learningresources'), content: <Resources /> });

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
    const { subtopics, subjectId, t } = this.props;
    const tabs = buildTabList(t, subtopics, subjectId);
    return (
      <div className="c-resources u-margin-top-large">
        <Tabs tabs={tabs} />
      </div>
    );
  }
}

TopicTabs.propTypes = {
  subjectId: PropTypes.string.isRequired,
  fetchTopicResources: PropTypes.func.isRequired,
  topic: TopicShape.isRequired,
  subtopics: PropTypes.arrayOf(TopicShape).isRequired,
};

const mapDispatchToProps = {
  fetchTopicResources: actions.fetchTopicResources,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topic: { id: topicId } } = ownProps;
  return ({
    subtopics: getSubtopicsWithIntroduction(subjectId, topicId)(state),
  });
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(TopicTabs);
