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
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { TopicShape } from '../../../shapes';
import { toTopic } from '../subjectPageHelpers';
import { topicIntroductionMessages } from '../../../util/topicsHelper';

const SubjectPageTopics = props => {
  const { t, topics, subjectId, twoColumns, subjectPage, ndlaFilm } = props;
  return (
    <ResourcesWrapper
      subjectPage
      invertedStyle={ndlaFilm}
      header={<ResourcesTitle>{t('topicPage.topics')}</ResourcesTitle>}>
      <div data-testid="topic-list">
        <TopicIntroductionList
          toTopic={toTopic(subjectId)}
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
  topics: PropTypes.arrayOf(TopicShape),
  subjectId: PropTypes.string.isRequired,
  twoColumns: PropTypes.bool,
  subjectPage: PropTypes.bool,
  ndlaFilm: PropTypes.bool,
};

SubjectPageTopics.defaultProps = {
  twoColumns: false,
  subjectPage: false,
};

export default injectT(SubjectPageTopics);
