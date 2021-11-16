import Spinner from '@ndla/ui/lib/Spinner';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import MultidisciplinaryTopic from './MultidisciplinaryTopic';
import {
  GQLSubject,
  GQLTopicQuery,
  GQLTopicQueryVariables,
} from '../../../graphqlTypes';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
import { LocaleType } from '../../../interfaces';

interface Props {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  subject: GQLSubject;
  ndlaFilm?: boolean;
  disableNav?: boolean;
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
  const { data, loading } = useGraphQuery<
    GQLTopicQuery,
    GQLTopicQueryVariables
  >(topicQuery, {
    variables: { topicId, subjectId },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data?.topic) {
    return <DefaultErrorMessage />;
  }

  return (
    <MultidisciplinaryTopic
      topic={data.topic}
      resourceTypes={data.resourceTypes}
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
