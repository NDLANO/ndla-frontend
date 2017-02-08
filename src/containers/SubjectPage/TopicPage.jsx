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
import * as actions from './subjectActions';
import { getSubjectById, getTopic } from './subjectSelectors';
import TopicCardList from './components/TopicCardList';

class TopicPage extends Component {
  componentWillMount() {
    const { params: { subjectId, topicId }, fetchTopicsAndArticle, fetchSubjects } = this.props;
    fetchSubjects();
    fetchTopicsAndArticle({ subjectId, topicId });
  }

  componentWillReceiveProps(nextProps) {
    const { params: { subjectId, topicId }, fetchTopicsAndArticle } = this.props;

    if (nextProps.params.topicId !== topicId) {
      fetchTopicsAndArticle({ subjectId, topicId });
    }
  }

  render() {
    const { subject, topic } = this.props;
    if (!topic) {
      return null;
    }

    const topics = defined(topic.subtopics, []);
    return (
      <OneColumn>
        <div className="o-layout">
          { topic ? <h1>{topic.name}</h1> : <h1>{subject.name}</h1>}
          <TopicCardList className="o-layout__item u-2/3" subjectId={subject.id} topics={topics} />
        </div>
      </OneColumn>
    );
  }
}

TopicPage.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string.isRequired,
    topicId: PropTypes.string,
  }).isRequired,
  fetchTopicsAndArticle: PropTypes.func.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
  subject: PropTypes.object,
  topic: PropTypes.object,
};

const mapDispatchToProps = {
  fetchSubjects: actions.fetchSubjects,
  fetchTopicsAndArticle: actions.fetchTopicsAndArticle,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.params;
  return {
    topic: topicId ? getTopic(subjectId, topicId)(state) : undefined,
    subject: getSubjectById(subjectId)(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);
