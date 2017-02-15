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
import Helmet from 'react-helmet';

import * as actions from './topicActions';
import * as subjectActions from '../SubjectPage/subjectActions';
import { getTopicArticle, getTopic } from './topicSelectors';
import TopicArticle from './components/TopicArticle';
import Resources from './components/Resources';
import { ArticleShape, TopicShape } from '../../shapes';
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
    const { params: { subjectId }, topic, article, t } = this.props;
    if (!topic) {
      return null;
    }

    const metaDescription = article ? { name: 'description', content: article.metaDescription } : {};
    const title = article ? article.title : topic.name;
    const scripts = article ? article.requiredLibraries.map(lib => ({ src: lib.url, type: lib.mediaType })) : [];
    return (
      <OneColumn>
        <Helmet
          title={`NDLA | ${title}`}
          meta={[metaDescription]}
          script={scripts}
        />
        { article ? <TopicArticle article={article} openTitle={`${t('topicPage.openArticleTopic')}`} closeTitle={t('topicPage.closeArticleTopic')} /> : null }
        <Resources subjectId={subjectId} topic={topic} topicId={topic.id} />
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
  topic: TopicShape,
  article: ArticleShape,
};

const mapDispatchToProps = {
  fetchSubjects: subjectActions.fetchSubjects,
  fetchTopicArticle: actions.fetchTopicArticle,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.params;
  return {
    topic: getTopic(subjectId, topicId)(state),
    article: getTopicArticle(subjectId, topicId)(state),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(TopicPage);
