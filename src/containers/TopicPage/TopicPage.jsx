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
import { OneColumn, TopicArticle, TopicBreadcrumb } from 'ndla-ui';
import Helmet from 'react-helmet';

import * as actions from './topicActions';
import * as subjectActions from '../SubjectPage/subjectActions';
import { getTopicArticle, getTopic, getTopicPath } from './topicSelectors';
import { getSubjectById } from '../SubjectPage/subjectSelectors';
import TopicTabs from './TopicTabs';
import { SubjectShape, ArticleShape, TopicShape } from '../../shapes';
import { injectT } from '../../i18n';
import { toTopic } from '../../routes';

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
    const { params: { subjectId }, topic, article, t, topicPath, subject } = this.props;
    if (!topic) {
      return null;
    }

    const metaDescription = article ? { name: 'description', content: article.metaDescription } : {};
    const title = article ? article.title : topic.name;
    const scripts = article ? article.requiredLibraries.map(lib => ({ src: lib.url, type: lib.mediaType })) : [];
    return (
      <div>
        <OneColumn>
          <Helmet
            title={`NDLA | ${title}`}
            meta={[metaDescription]}
            script={scripts}
          />
          { subject ? <TopicBreadcrumb subject={subject} topicPath={topicPath.slice(0, -1)} toTopic={toTopic}>{t('topicPage.breadcrumbLabel')}</TopicBreadcrumb> : null }
          { article ? <TopicArticle article={article} openTitle={`${t('topicPage.openArticleTopic')}`} closeTitle={t('topicPage.closeArticleTopic')} /> : null }
        </OneColumn>
        <TopicTabs subjectId={subjectId} topic={topic} topicPath={topicPath} />
      </div>
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
  topic: TopicShape,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  article: ArticleShape,
};

const mapDispatchToProps = {
  fetchSubjects: subjectActions.fetchSubjects,
  fetchTopicArticle: actions.fetchTopicArticle,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.params;
  const getTopicSelector = getTopic(subjectId, topicId);
  const getTopicArticleSelector = getTopicArticle(subjectId, topicId);
  const getTopicPathSelector = getTopicPath(subjectId, topicId);
  const getSubjectByIdSelector = getSubjectById(subjectId);
  return {
    topic: getTopicSelector(state),
    article: getTopicArticleSelector(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(TopicPage);
