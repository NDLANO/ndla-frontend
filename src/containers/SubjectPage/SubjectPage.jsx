/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  OneColumn,
  SubjectHero,
  ErrorMessage,
  TopicIntroductionList,
  FilterList,
} from 'ndla-ui';
import Link from 'react-router-dom/Link';
import defined from 'defined';
import { injectT } from 'ndla-i18n';

import connectSSR from '../../components/connectSSR';
import { actions } from './subjects';
import {
  actions as topicActions,
  getTopicsBySubjectIdWithIntroduction,
  getTopic,
  getFetchTopicsStatus,
} from '../TopicPage/topic';
import {
  actions as filterActions,
  getActiveFilter,
  getFilters,
} from '../Filters/filter';
import { SubjectShape, TopicShape } from '../../shapes';
import { toTopicPartial } from '../../routeHelpers';

const toTopic = subjectId => toTopicPartial(subjectId);

class SubjectPage extends Component {
  static getInitialProps(ctx) {
    const {
      match: { params: { subjectId } },
      fetchTopicsWithIntroductions,
      fetchSubjects,
      fetchSubjectFilters,
    } = ctx;
    fetchSubjects();
    fetchSubjectFilters(subjectId);
    fetchTopicsWithIntroductions({ subjectId });
  }

  componentDidMount() {
    SubjectPage.getInitialProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params: { subjectId } },
      fetchTopicsWithIntroductions,
    } = this.props;

    if (nextProps.match.params.subjectId !== subjectId) {
      fetchTopicsWithIntroductions({
        subjectId: nextProps.match.params.subjectId,
      });
    }
  }

  handleFilterClick = e => {
    const {
      match: { params: { subjectId } },
      filters,
      setActiveFilter,
    } = this.props;
    const filterId = filters.find(it => it.name === e.target.id).id;
    setActiveFilter({ filterId, subjectId });
  };

  render() {
    const {
      subjectTopics,
      t,
      topic,
      match,
      hasFailed,
      filters,
      activeFilters,
    } = this.props;
    const { params: { subjectId } } = match;

    const topics = topic ? defined(topic.subtopics, []) : subjectTopics;
    return (
      <div>
        <SubjectHero>
          <OneColumn cssModifier="narrow">
            <div className="c-hero__content">
              <section>
                <div className="c-breadcrumb">
                  <ol className="c-breadcrumb__list">
                    <li className="c-breadcrumb__item">
                      <Link to="/">{t('breadcrumb.subjectsLinkText')}</Link> ›
                    </li>
                  </ol>
                </div>
              </section>
            </div>
          </OneColumn>
        </SubjectHero>
        <OneColumn>
          <article className="c-article">
            <section className="u-4/6@desktop u-push-1/6@desktop">
              <FilterList
                filterContent={filters.map(filt => ({
                  ...filt,
                  title: filt.name,
                  active: !!activeFilters.find(actId => actId === filt.id),
                }))}
                onClick={this.handleFilterClick}
              />
              {hasFailed ? (
                <ErrorMessage
                  messages={{
                    title: t('errorMessage.title'),
                    description: t('subjectPage.errorDescription'),
                    back: t('errorMessage.back'),
                    goToFrontPage: t('errorMessage.goToFrontPage'),
                  }}
                />
              ) : (
                <div className="c-resources">
                  <h1 className="c-resources__title">
                    {t('subjectPage.tabs.topics')}
                  </h1>
                  <TopicIntroductionList
                    toTopic={toTopic(subjectId)}
                    topics={
                      activeFilters.length === 0
                        ? topics
                        : topics.filter(
                            top =>
                              top.filter &&
                              !activeFilters.find(
                                active => top.filter.indexOf(active) === -1,
                              ),
                          )
                    }
                  />
                </div>
              )}
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
  fetchTopicsWithIntroductions: PropTypes.func.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
  hasFailed: PropTypes.bool.isRequired,
  subjectTopics: PropTypes.arrayOf(TopicShape).isRequired,
  subject: SubjectShape,
  topic: TopicShape,
  filters: PropTypes.arrayOf(PropTypes.object),
  setActiveFilter: PropTypes.func,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
};

const mapDispatchToProps = {
  fetchSubjects: actions.fetchSubjects,
  fetchSubjectFilters: filterActions.fetchSubjectFilters,
  fetchTopicsWithIntroductions: topicActions.fetchTopicsWithIntroductions,
  setActiveFilter: filterActions.setActive,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.match.params;
  return {
    topic: topicId ? getTopic(subjectId, topicId)(state) : undefined,
    subjectTopics: getTopicsBySubjectIdWithIntroduction(subjectId)(state),
    hasFailed: getFetchTopicsStatus(state) === 'error',
    filters: getFilters(subjectId)(state),
    activeFilters: getActiveFilter(subjectId)(state) || [],
  };
};

export default compose(
  connectSSR(mapStateToProps, mapDispatchToProps),
  injectT,
)(SubjectPage);
