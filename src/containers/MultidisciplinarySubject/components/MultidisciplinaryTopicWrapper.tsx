import React from 'react';

import Spinner from '@ndla/ui/lib/Spinner';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import MultidisciplinaryTopic from './MultidisciplinaryTopic';
import { GQLResourceType, GQLSubject, GQLTopic } from '../../../graphqlTypes';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
import { LocaleType } from '../../../interfaces';

interface Props {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  subject: GQLSubject & { allTopics: GQLTopic[] };
  ndlaFilm?: boolean;
  disableNav?: boolean;
}

interface Data {
  topic: GQLTopic;
  resourceTypes: Array<GQLResourceType>;
}

const MultidisciplinaryTopicWrapper = ({
  topicId,
  subjectId,
  locale,
  subTopicId,
  ndlaFilm,
  subject,
  disableNav,
}: Props) => {
  const { data, loading } = useGraphQuery<Data>(topicQuery, {
    variables: { topicId, subjectId },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  return (
    <MultidisciplinaryTopic
      data={data}
      topicId={topicId}
      subjectId={subjectId}
      subTopicId={subTopicId}
      locale={locale}
      ndlaFilm={ndlaFilm}
      subject={subject}
      disableNav={disableNav}
    />
  );
};

export default MultidisciplinaryTopicWrapper;
