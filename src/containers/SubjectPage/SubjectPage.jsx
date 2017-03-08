/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { OneColumn, TopicIntroductionList } from 'ndla-ui';
import defined from 'defined';
import * as actions from './subjectActions';
import * as topicActions from '../TopicPage/topicActions';
import { getSubjectById } from './subjectSelectors';
import { getTopicsBySubjectId, getTopic } from '../TopicPage/topicSelectors';
import { SubjectShape, TopicShape } from '../../shapes';
import { toTopicPartial } from '../../routes';

const toTopic = subjectId => toTopicPartial(subjectId);

class SubjectPage extends Component {
  componentWillMount() {
    const { params: { subjectId }, fetchTopics, fetchSubjects } = this.props;
    fetchSubjects();
    fetchTopics({ subjectId });
  }

  componentWillReceiveProps(nextProps) {
    const { params: { subjectId }, fetchTopics } = this.props;

    if (nextProps.params.subjectId !== subjectId) {
      fetchTopics({ subjectId: nextProps.params.subjectId });
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
        <TopicIntroductionList
          subjectId={subject.id}
          toTopic={toTopic(subject.id)}
          topics={topics}
          goToTopicTitle="Gå til emne"
          goToTopicResourcesTitle="Se fagstoff"
          toTopicResources={toTopic(subject.id)}
        />
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
  subjectTopics: PropTypes.arrayOf(TopicShape).isRequired,
  subject: SubjectShape,
  topic: TopicShape,
};

const mapDispatchToProps = {
  fetchSubjects: actions.fetchSubjects,
  fetchTopics: topicActions.fetchTopics,
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
