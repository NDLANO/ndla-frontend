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
import { getSubjectById, getTopicsBySubjectId, getTopic } from './subjectSelectors';
import TopicMenu from './components/TopicMenu';
import TopicCardList from './components/TopicCardList';

class SubjectPage extends Component {
  componentWillMount() {
    const { params: { subjectId }, fetchTopics } = this.props;
    fetchTopics(subjectId);
  }

  componentWillReceiveProps(nextProps) {
    const { params: { subjectId }, fetchTopics } = this.props;

    if (nextProps.params.subjectId !== subjectId) {
      fetchTopics(nextProps.params.subjectId);
    }
  }

  render() {
    const { subjectTopics, subject, topic } = this.props;
    if (!subject) {
      return null;
    }

    const topics = topic ? topic.subtopics : subjectTopics;
    const heading = topic ? topic.name : subject.name;
    return (
      <OneColumn>
        <div className="o-layout">
          {subject ? <TopicMenu className="o-layout__item u-1/3" heading={heading} topics={topics} /> : <div className="o-layout__item u-1/3" />}
          <TopicCardList className="o-layout__item u-2/3" topics={topics} />
        </div>
      </OneColumn>
    );
  }
}

SubjectPage.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string.isRequired,
    topicId: PropTypes.string,
  }).isRequired,
  fetchTopics: PropTypes.func.isRequired,
  subjectTopics: PropTypes.array.isRequired,
  subject: PropTypes.object,
  topic: PropTypes.object,
};

const mapDispatchToProps = {
  fetchTopics: actions.fetchTopics,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.params;
  return {
    topic: topicId ? getTopic(subjectId, topicId)(state) : undefined,
    subjectTopics: getTopicsBySubjectId(subjectId)(state),
    subject: getSubjectById(subjectId)(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubjectPage);
