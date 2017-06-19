/**
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
import { OneColumn, Hero, TopicIntroductionList } from 'ndla-ui';
import Link from 'react-router-dom/Link';
import defined from 'defined';
import { injectT } from '../../i18n';
import * as topicActions from '../TopicPage/topicActions';
import { actions, getSubjectById } from './subjects';
import {
  getTopicsBySubjectIdWithIntroduction,
  getTopic,
} from '../TopicPage/topicSelectors';
import { SubjectShape, TopicShape } from '../../shapes';
import { toTopicPartial } from '../../routes';

const toTopic = subjectId => toTopicPartial(subjectId);

class SubjectPage extends Component {
  componentWillMount() {
    const {
      match: { params: { subjectId } },
      fetchTopics,
      fetchSubjects,
    } = this.props;
    fetchSubjects();
    fetchTopics({ subjectId });
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { subjectId } }, fetchTopics } = this.props;

    if (nextProps.match.params.subjectId !== subjectId) {
      fetchTopics({ subjectId: nextProps.match.params.subjectId });
    }
  }

  render() {
    const { subjectTopics, subject, t, topic } = this.props;
    if (!subject) {
      return null;
    }

    const topics = topic ? defined(topic.subtopics, []) : subjectTopics;
    return (
      <div>
        <Hero>
          <OneColumn cssModifier="narrow">
            <div className="c-hero__content">
              <section>
                <div className="c-breadcrumb">
                  {/* {t('breadcrumb.label')}*/}
                  <ol className="c-breadcrumb__list">
                    <li className="c-breadcrumb__item">
                      <Link to="/">{t('breadcrumb.subjectsLinkText')}</Link> ›
                    </li>
                  </ol>
                </div>
                {/* <h1 className="c-hero__title">{subject.name}</h1>*/}
              </section>
            </div>
          </OneColumn>
        </Hero>
        <OneColumn>
          <article className="c-article">
            <section className="u-4/6@desktop u-push-1/6@desktop">
              <div className="c-resources">
                <h1 className="c-resources__title">
                  {t('subjectPage.tabs.topics')}
                </h1>
                <TopicIntroductionList
                  toTopic={toTopic(subject.id)}
                  topics={topics}
                />
              </div>
            </section>
          </article>
        </OneColumn>
      </div>
    );
  }
}

SubjectPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
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
  const { subjectId, topicId } = ownProps.match.params;
  return {
    topic: topicId ? getTopic(subjectId, topicId)(state) : undefined,
    subjectTopics: getTopicsBySubjectIdWithIntroduction(subjectId)(state),
    subject: getSubjectById(subjectId)(state),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps), injectT)(
  SubjectPage,
);
