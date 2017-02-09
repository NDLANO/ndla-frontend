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
import Helmet from 'react-helmet';
import isEmpty from 'lodash/isEmpty';

import * as actions from './subjectActions';
import { getTopicArticle, getSubjectById, getTopic } from './subjectSelectors';
import TopicArticle from './components/TopicArticle';
import TopicCardList from './components/TopicCardList';
import { SubjectShape, TopicShape } from '../../shapes';

class TopicPage extends Component {
  componentWillMount() {
    const { params: { subjectId, topicId }, fetchTopicsAndArticle, fetchSubjects } = this.props;
    fetchSubjects();
    fetchTopicsAndArticle({ subjectId, topicId });
  }

  componentWillReceiveProps(nextProps) {
    const { params: { subjectId, topicId }, fetchTopicsAndArticle } = this.props;

    if (nextProps.params.topicId !== topicId) {
      fetchTopicsAndArticle({ subjectId, topicId: nextProps.params.topicId });
    }
  }

  render() {
    const { subject, topic, article } = this.props;
    if (!topic) {
      return null;
    }

    const topics = defined(topic.subtopics, []);
    const metaDescription = article.metaDescription ? { name: 'description', content: article.metaDescription } : {};
    const scripts = article.requiredLibraries ? article.requiredLibraries.map(lib => ({ src: lib.url, type: lib.mediaType })) : [];
    return (
      <OneColumn>
        <Helmet
          title={`NDLA | ${article.title}`}
          meta={[metaDescription]}
          script={scripts}
        />
        { !isEmpty(article) ? <TopicArticle article={article} /> : null }
        <TopicCardList className="o-layout__item u-2/3" subjectId={subject.id} topics={topics} />
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
  subject: SubjectShape,
  topic: TopicShape,
  article: PropTypes.object,
};

const mapDispatchToProps = {
  fetchSubjects: actions.fetchSubjects,
  fetchTopicsAndArticle: actions.fetchTopicsAndArticle,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.params;
  return {
    topic: getTopic(subjectId, topicId)(state),
    subject: getSubjectById(subjectId)(state),
    article: getTopicArticle(subjectId, topicId)(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);
