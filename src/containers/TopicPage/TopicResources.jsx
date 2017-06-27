/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectT } from 'ndla-i18n';
import { TopicShape } from '../../shapes';
import Resources from '../Resources/Resources';
import { actions, getResourcesByTopicId } from '../Resources/resource';

class TopicResources extends Component {
  componentWillMount() {
    const {
      subjectId,
      topic: { id: topicId },
      fetchTopicResources,
    } = this.props;
    fetchTopicResources({ subjectId, topicId });
  }

  componentWillReceiveProps(nextProps) {
    const { topic, subjectId, fetchTopicResources } = this.props;
    if (nextProps.topic.id !== topic.id) {
      fetchTopicResources({ subjectId, topicId: nextProps.topic.id });
    }
  }

  render() {
    const { topic: { id: topicId } } = this.props;
    return <Resources topicId={topicId} />;
  }
}

TopicResources.propTypes = {
  subjectId: PropTypes.string.isRequired,
  fetchTopicResources: PropTypes.func.isRequired,
  topic: TopicShape.isRequired,
};

const mapDispatchToProps = {
  fetchTopicResources: actions.fetchTopicResources,
};

const mapStateToProps = (state, ownProps) => {
  const { topic: { id: topicId } } = ownProps;
  return {
    resources: getResourcesByTopicId(topicId)(state),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps), injectT)(
  TopicResources,
);
