/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import {
  //@ts-ignore
  TopicIntroductionList,
  //@ts-ignore
  ResourcesWrapper,
  //@ts-ignore
  ResourcesTitle,
} from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { toTopic } from '../subjectPageHelpers';
import { topicIntroductionMessages } from '../../../util/topicsHelper';
import { GQLTopic } from '../../../graphqlTypes';

interface Props {
  topics: Array<GQLTopic>;
  subjectId: string;
  twoColumns: boolean;
  subjectPage: boolean;
  ndlaFilm: boolean;
  handleFilterClick: () => void;
}

const SubjectPageTopics = ({
  t,
  topics,
  subjectId,
  twoColumns = false,
  subjectPage = false,
  ndlaFilm,
}: Props & tType) => {
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

export default injectT(SubjectPageTopics);
