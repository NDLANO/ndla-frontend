/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  OneColumn,
  SubjectChildContent,
  SubjectFlexWrapper,
  SubjectContent,
  TopicIntroductionList,
  ResourcesWrapper,
  ResourcesTitle,
  SubjectFilter,
} from '@ndla/ui';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import { GraphQLSubjectPageShape } from '../../../../graphqlShapes';
import { TopicShape } from '../../../../shapes';
import SubjectPageSidebar from '../SubjectPageSidebar';
import SubjectPageInformation from '../SubjectPageInformation';
import SubjectEditorChoices from '../SubjectEditorChoices';
import { toTopic } from '../../subjectPageHelpers';
import { topicIntroductionMessages } from '../../../../util/topicsHelper';

export const classes = new BEMHelper({
  name: 'subject-topic-language-container',
  prefix: 'c-',
});

class SubjectPageStacked extends React.PureComponent {
  constructor() {
    super();
    this.getFilteredTopics = this.getFilteredTopics.bind(this);
  }

  getFilteredTopics() {
    const { filters, topics } = this.props;
    return filters
      .map(value => ({
        topics: topics.filter(topic =>
          topic.filters.map(filter => filter.name).includes(value.name),
        ),
        key: value.id,
        heading: value.name,
      }))
      .filter(values => values.topics.length);
  }

  render() {
    const {
      subjectpage,
      handleFilterClick,
      filters,
      breadcrumb,
      subjectId,
      activeFilters,
      t,
    } = this.props;
    const { editorsChoices } = subjectpage;
    const filtredTopics = this.getFilteredTopics();

    return (
      <Fragment>
        <OneColumn>
          <SubjectContent twoColumns breadcrumb={breadcrumb}>
            <ResourcesWrapper
              subjectPage
              header={<ResourcesTitle>{t('topicPage.topics')}</ResourcesTitle>}>
              <div data-testid="topic-list">
                <SubjectFilter
                  label={t('subjectPage.subjectFilter.label')}
                  options={filters}
                  values={activeFilters}
                  onChange={handleFilterClick}
                />
                {filtredTopics.map(filterTopics => (
                  <div {...classes()} key={filterTopics.key}>
                    <h1 {...classes('heading')}>{filterTopics.heading}</h1>
                    <TopicIntroductionList
                      toTopic={toTopic(subjectId, activeFilters)}
                      topics={filterTopics.topics}
                      messages={topicIntroductionMessages(t)}
                      twoColumns
                      subjectPage
                      toggleAdditionalCores={() => {}}
                    />
                  </div>
                ))}
              </div>
            </ResourcesWrapper>
            <SubjectChildContent>
              <SubjectFlexWrapper>
                <SubjectPageSidebar
                  subjectpage={subjectpage}
                  subjectId={subjectId}
                  twoColumns
                />
              </SubjectFlexWrapper>
              <SubjectEditorChoices
                narrowScreen
                editorsChoices={editorsChoices}
              />
            </SubjectChildContent>
          </SubjectContent>
        </OneColumn>
        <OneColumn noPadding>
          <SubjectChildContent>
            <SubjectFlexWrapper>
              <SubjectPageInformation subjectpage={subjectpage} twoColumns />
            </SubjectFlexWrapper>
          </SubjectChildContent>
        </OneColumn>
      </Fragment>
    );
  }
}

SubjectPageStacked.propTypes = {
  handleFilterClick: PropTypes.func.isRequired,
  subjectpage: GraphQLSubjectPageShape,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  topics: PropTypes.arrayOf(TopicShape),
  breadcrumb: PropTypes.node,
  subjectId: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
};

export default injectT(SubjectPageStacked);
