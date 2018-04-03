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
import Helmet from 'react-helmet';
import {
  OneColumn,
  SubjectHero,
  ErrorMessage,
  TopicIntroductionList,
  FilterList,
  Breadcrumb,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withTracker } from 'ndla-tracker';
import connectSSR from '../../components/connectSSR';
import { actions, getSubjectById } from './subjects';
import {
  actions as topicActions,
  getTopicsBySubjectIdWithIntroductionFiltered,
  getFetchTopicsStatus,
} from '../TopicPage/topic';
import {
  actions as filterActions,
  getActiveFilter,
  getFilters,
} from '../Filters/filter';
import { SubjectShape, TopicShape } from '../../shapes';
import {
  toBreadcrumbItems,
  toTopicPartial,
  getUrnIdsFromProps,
} from '../../routeHelpers';

const toTopic = subjectId => toTopicPartial(subjectId);

class SubjectPage extends Component {
  static getInitialProps(ctx) {
    const {
      fetchTopicsWithIntroductions,
      fetchSubjects,
      fetchSubjectFilters,
    } = ctx;

    const { subjectId } = getUrnIdsFromProps(ctx);
    fetchSubjects();
    fetchSubjectFilters(subjectId);
    fetchTopicsWithIntroductions({ subjectId });
  }

  static getDocumentTitle({ t, subject }) {
    return `${subject ? subject.name : ''} ${t('htmlTitles.titleTemplate')}`;
  }

  static willTrackPageView(trackPageView, currentProps) {
    const { subject, subjectTopics } = currentProps;
    if (subject && subjectTopics && subjectTopics.length > 0) {
      trackPageView(currentProps);
    }
  }

  handleFilterClick = (newValues, filterId) => {
    const { setActiveFilter } = this.props;
    const { subjectId } = getUrnIdsFromProps(this.props);
    setActiveFilter({ newValues, subjectId, filterId });
  };

  render() {
    const {
      subject,
      subjectTopics,
      t,
      match,
      hasFailed,
      filters,
      activeFilters,
    } = this.props;
    const { params: { subjectId } } = match;
    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SubjectHero>
          <OneColumn cssModifier="narrow">
            <div className="c-hero__content">
              <section>
                {subject && <Breadcrumb items={toBreadcrumbItems(subject)} />}
              </section>
            </div>
          </OneColumn>
        </SubjectHero>
        <OneColumn>
          <article className="c-article">
            <section className="u-4/6@desktop u-push-1/6@desktop">
              <FilterList
                options={filters}
                values={activeFilters}
                onChange={this.handleFilterClick}
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
                    topics={subjectTopics}
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
  const { subjectId } = getUrnIdsFromProps(ownProps);
  return {
    subjectTopics: getTopicsBySubjectIdWithIntroductionFiltered(subjectId)(
      state,
    ),
    hasFailed: getFetchTopicsStatus(state) === 'error',
    filters: getFilters(subjectId)(state),
    subject: getSubjectById(subjectId)(state),
    activeFilters: getActiveFilter(subjectId)(state) || [],
  };
};

export default compose(
  connectSSR(mapStateToProps, mapDispatchToProps),
  injectT,
  withTracker,
)(SubjectPage);
