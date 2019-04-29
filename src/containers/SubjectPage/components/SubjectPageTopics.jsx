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
  TopicIntroductionList,
  ResourcesWrapper,
  ResourcesTitle,
  SubjectFilter,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { TopicShape } from '../../../shapes';
import { toTopic } from '../subjectPageHelpers';
import { topicIntroductionMessages } from '../../../util/topicsHelper';

const SubjectPageTopics = props => {
  const {
    t,
    handleFilterClick,
    filters,
    topics,
    subjectId,
    activeFilters,
    twoColumns,
    subjectPage,
  } = props;
  return (
    <ResourcesWrapper
      subjectPage
      header={<ResourcesTitle>{t('topicPage.topics')}</ResourcesTitle>}>
      <div data-testid="topic-list">
        {filters && filters.length > 1 && (
          <SubjectFilter
            label={t('subjectPage.subjectFilter.label')}
            options={filters}
            values={activeFilters}
            onChange={handleFilterClick}
          />
        )}
        <TopicIntroductionList
          toTopic={toTopic(subjectId, activeFilters)}
          topics={topics}
          messages={topicIntroductionMessages(t)}
          toggleAdditionalCores={() => {}}
          twoColumns={twoColumns}
          subjectPage={subjectPage}
        />
      </div>
    </ResourcesWrapper>
  );
};

SubjectPageTopics.propTypes = {
  handleFilterClick: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  topics: PropTypes.arrayOf(TopicShape),
  subjectId: PropTypes.string.isRequired,
  twoColumns: PropTypes.bool,
  subjectPage: PropTypes.bool,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
};

SubjectPageTopics.defaultProps = {
  twoColumns: false,
  subjectPage: false,
};

export default injectT(SubjectPageTopics);
