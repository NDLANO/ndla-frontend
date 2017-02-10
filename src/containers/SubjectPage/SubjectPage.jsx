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
import defined from 'defined';
import TopicDescriptionList from './components/TopicDescriptionList';
import * as actions from './subjectActions';
import { getSubjectById, getTopicsBySubjectId, getTopic } from './subjectSelectors';

class SubjectPage extends Component {
  componentWillMount() {
    const { params: { subjectId }, fetchTopics, fetchSubjects } = this.props;
    fetchSubjects();
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

    const topics = topic ? defined(topic.subtopics, []) : subjectTopics;
    return (
      <OneColumn>
        { topic ? <h1>{topic.name}</h1> : <h1>{subject.name}</h1>}
        <TopicDescriptionList subjectId={subject.id} topics={topics} />
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
  fetchSubjects: PropTypes.func.isRequired,
  subjectTopics: PropTypes.array.isRequired,
  subject: PropTypes.object,
  topic: PropTypes.object,
};

const mapDispatchToProps = {
  fetchSubjects: actions.fetchSubjects,
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
