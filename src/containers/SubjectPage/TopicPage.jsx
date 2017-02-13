/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { OneColumn } from 'ndla-ui';
// import defined from 'defined';
import Helmet from 'react-helmet';

import * as actions from './subjectActions';
import { getTopicArticle, getSubjectById, getTopic } from './subjectSelectors';
import TopicArticle from './components/TopicArticle';
import Resources from './components/Resources';
import { SubjectShape, ArticleShape, TopicShape } from '../../shapes';
import { injectT } from '../../i18n';

class TopicPage extends Component {
  componentWillMount() {
    const { params: { subjectId, topicId }, fetchTopicArticle, fetchSubjects } = this.props;
    fetchSubjects();
    fetchTopicArticle({ subjectId, topicId });
  }

  componentWillReceiveProps(nextProps) {
    const { params: { subjectId, topicId }, fetchTopicArticle } = this.props;

    if (nextProps.params.topicId !== topicId) {
      fetchTopicArticle({ subjectId, topicId: nextProps.params.topicId });
    }
  }

  render() {
    const { subject, topic, article } = this.props;
    if (!topic) {
      return null;
    }

    // const topics = defined(topic.subtopics, []);
    const metaDescription = article ? { name: 'description', content: article.metaDescription } : {};
    const title = article ? article.title : '';
    const scripts = article ? article.requiredLibraries.map(lib => ({ src: lib.url, type: lib.mediaType })) : [];
    return (
      <OneColumn>
        <Helmet
          title={`NDLA | ${title}`}
          meta={[metaDescription]}
          script={scripts}
        />
        { article ? <TopicArticle article={article} /> : null }
        <Resources subjectId={subject.id} topicId={topic.id} />
      </OneColumn>
    );
  }
}

TopicPage.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string.isRequired,
    topicId: PropTypes.string,
  }).isRequired,
  fetchTopicArticle: PropTypes.func.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
  subject: SubjectShape,
  topic: TopicShape,
  article: ArticleShape,
};

const mapDispatchToProps = {
  fetchSubjects: actions.fetchSubjects,
  fetchTopicArticle: actions.fetchTopicArticle,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.params;
  return {
    topic: getTopic(subjectId, topicId)(state),
    subject: getSubjectById(subjectId)(state),
    article: getTopicArticle(subjectId, topicId)(state),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(TopicPage);
