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
import { getSubtopicsWithIntroduction } from '../topicSelectors';
import * as actions from '../topicActions';
import { injectT } from '../../../i18n';
import { TopicShape } from '../../../shapes';
import { toTopic } from '../../../routes';


function buildLicenseTabList(t, topics, subjectId) {
  const tabs = [];

  tabs.push({ key: 'topics', displayName: t('resources.tabs.topics'), content: <TopicIntroductionList subjectId={subjectId} toTopic={toTopic} topics={topics} /> });
  tabs.push({ key: 'learningresources', displayName: t('resources.tabs.learningresources'), content: <p>Læringsressurser</p> });

  return tabs;
}


class Resources extends Component {
  componentWillMount() {
    this.props.fetchTopicResources(this.props.topic);
  }

  componentWillReceiveProps(nextProps) {
    const { topic, fetchTopicResources } = this.props;
    if (nextProps.topic.id !== topic.id) {
      fetchTopicResources(nextProps.topic);
    }
  }

  render() {
    const { topics, subjectId, t } = this.props;
    const tabs = buildLicenseTabList(t, topics, subjectId);
    return (
      <div className="c-resources u-margin-top-large">
        <Tabs tabs={tabs} />
      </div>
    );
  }
}

Resources.propTypes = {
  topicId: PropTypes.string.isRequired,
  subjectId: PropTypes.string.isRequired,
  fetchTopicResources: PropTypes.func.isRequired,
  topic: TopicShape.isRequired,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
};

const mapDispatchToProps = {
  fetchTopicResources: actions.fetchTopicResources,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps;
  return ({
    topics: getSubtopicsWithIntroduction(subjectId, topicId)(state),
  });
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(Resources);
