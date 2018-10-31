/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
} from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import { injectT } from 'ndla-i18n';
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
    this.getSortedTopics = this.getSortedTopics.bind(this);
  }

  getSortedTopics() {
    const { filters, topics } = this.props;
    return filters
      .map(value => ({
        topics: topics.filter(topic => topic.filters.map(filter => filter.name).includes(value.name)),
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
    const sortedTopics = this.getSortedTopics();
    // TODO: FIX TRANSLATION
    return [
      <OneColumn noPadding key="subjectpage_content">
        <SubjectContent twoColumns breadcrumb={breadcrumb}>
          <ResourcesWrapper
          subjectPage
          header={<ResourcesTitle>Emner</ResourcesTitle>}>
          <div data-testid="topic-list">
            <SubjectFilter
                label={t('subjectPage.subjectFilter.label')}
                options={filters}
                values={activeFilters}
                onChange={handleFilterClick}
              />
              {sortedTopics.map(filteredTopics => (
                <div {...classes()} key={filteredTopics.key}>
                  <h1>{filteredTopics.heading}</h1>
                  <TopicIntroductionList
                    toTopic={toTopic(subjectId, activeFilters)}
                    topics={filteredTopics.topics.sort(
                      (a, b) =>
                        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
                    )}
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
              />
            </SubjectFlexWrapper>
            <SubjectEditorChoices narrowScreen editorsChoices={editorsChoices} />
          </SubjectChildContent>
        </SubjectContent>
      </OneColumn>,
      <OneColumn key="subjectpage_information" noPadding>
        <SubjectChildContent>
          <SubjectFlexWrapper>
            <SubjectPageInformation subjectpage={subjectpage} />
          </SubjectFlexWrapper>
        </SubjectChildContent>
      </OneColumn>,
    ];
  }
};

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
