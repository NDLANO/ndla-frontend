/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { OneColumn } from 'ndla-ui';
import * as actions from './subjectActions';
import { getTopicsBySubjectId } from './subjectSelectors';
import TopicMenu from './components/TopicMenu';

class SubjectPage extends Component {
  componentWillMount() {
    const { params: { subjectId }, fetchTopics } = this.props;
    fetchTopics(subjectId);
  }

  render() {
    const { params: { subjectId }, topics } = this.props;
    return (
      <OneColumn>
        <h1>{subjectId}</h1>
        <TopicMenu topics={topics} />
      </OneColumn>
    );
  }
}

SubjectPage.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string.isRequired,
  }).isRequired,
  fetchTopics: PropTypes.func.isRequired,
  topics: PropTypes.array.isRequired,
};

const mapDispatchToProps = {
  fetchTopics: actions.fetchTopics,
};

const makeMapStateToProps = (_, ownProps) => {
  const subjectId = ownProps.params.subjectId;
  const getTopicsSelector = getTopicsBySubjectId(subjectId);
  return state => ({
    topics: getTopicsSelector(state),
  });
};

export default connect(makeMapStateToProps, mapDispatchToProps)(SubjectPage);
