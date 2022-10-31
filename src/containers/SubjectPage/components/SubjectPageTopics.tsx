/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  //@ts-ignore
  TopicIntroductionList,
  ResourcesWrapper,
  ResourcesTitle,
} from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { toTopic } from '../subjectPageHelpers';
import { topicIntroductionMessages } from '../../../util/topicsHelper';
import { GQLTopic } from '../../../graphqlTypes';

interface Props {
  topics: Array<GQLTopic>;
  subjectId: string;
  twoColumns: boolean;
  subjectPage: boolean;
}

const SubjectPageTopics = ({
  topics,
  subjectId,
  twoColumns = false,
  subjectPage = false,
}: Props) => {
  const { t } = useTranslation();
  return (
    <ResourcesWrapper
      subjectPage
      header={<ResourcesTitle>{t('topicPage.topics')}</ResourcesTitle>}>
      <div data-testid="topic-list">
        <TopicIntroductionList
          toTopic={toTopic(subjectId)}
          //@ts-ignore
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

export default SubjectPageTopics;
