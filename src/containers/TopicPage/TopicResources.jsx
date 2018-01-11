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
import Resources from '../Resources/Resources';
import { actions, getResourcesByTopicId } from '../Resources/resource';

class TopicResources extends Component {
  componentWillMount() {
    const { subjectId, topicId, fetchTopicResources } = this.props;
    fetchTopicResources({ subjectId, topicId });
  }

  componentWillReceiveProps(nextProps) {
    const { topicId, subjectId, fetchTopicResources } = this.props;
    if (nextProps.topicId !== topicId) {
      fetchTopicResources({ subjectId, topicId: nextProps.topicId });
    }
  }

  render() {
    const { topicId } = this.props;
    return <Resources topicId={topicId} />;
  }
}

TopicResources.propTypes = {
  subjectId: PropTypes.string.isRequired,
  topicId: PropTypes.string.isRequired,
  fetchTopicResources: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchTopicResources: actions.fetchTopicResources,
};

const mapStateToProps = (state, ownProps) => {
  const { topicId } = ownProps;
  return {
    resources: getResourcesByTopicId(topicId)(state),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps), injectT)(
  TopicResources,
);
