import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '@ndla/ui/lib/Spinner';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import Topic from './Topic';
import { GraphQLSubjectShape } from '../../../graphqlShapes';

const TopicWrapper = ({
  topicId,
  subjectId,
  locale,
  subTopicId,
  ndlaFilm,
  onClickTopics,
  setBreadCrumb,
  index,
  showResources,
  subject,
}) => {
  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId },
    onCompleted: data => {
      setBreadCrumb({
        id: data.topic.id,
        label: data.topic.name,
        index: index,
      });
    },
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <Topic
      data={data}
      topicId={topicId}
      subjectId={subjectId}
      subTopicId={subTopicId}
      locale={locale}
      ndlaFilm={ndlaFilm}
      onClickTopics={onClickTopics}
      showResources={showResources}
      subject={subject}
      loading={loading}
    />
  );
};

TopicWrapper.propTypes = {
  topicId: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
  setSelectedTopic: PropTypes.func,
  subTopicId: PropTypes.string,
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  onClickTopics: PropTypes.func,
  setBreadCrumb: PropTypes.func,
  index: PropTypes.number,
  showResources: PropTypes.bool,
  subject: GraphQLSubjectShape,
};

export default TopicWrapper;
