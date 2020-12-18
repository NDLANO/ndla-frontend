import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '@ndla/ui/lib/Spinner';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import { GraphQLSubjectShape } from '../../../graphqlShapes';
import MultidisciplinaryTopic from './MultidisciplinaryTopic';

const MultidisciplinaryTopicWrapper = ({
  topicId,
  subjectId,
  filterIds,
  locale,
  subTopicId,
  ndlaFilm,
  onClickTopics,
  setBreadCrumb,
  index,
  showResources,
  subject,
  disableNav,
}) => {
  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId, filterIds },
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
    <MultidisciplinaryTopic
      data={data}
      topicId={topicId}
      subjectId={subjectId}
      filterIds={filterIds}
      subTopicId={subTopicId}
      locale={locale}
      ndlaFilm={ndlaFilm}
      onClickTopics={onClickTopics}
      showResources={showResources}
      subject={subject}
      loading={loading}
      disableNav={disableNav}
    />
  );
};

MultidisciplinaryTopicWrapper.propTypes = {
  topicId: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
  filterIds: PropTypes.string,
  setSelectedTopic: PropTypes.func,
  subTopicId: PropTypes.string,
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  onClickTopics: PropTypes.func,
  setBreadCrumb: PropTypes.func,
  index: PropTypes.number,
  showResources: PropTypes.bool,
  subject: GraphQLSubjectShape,
  disableNav: PropTypes.bool,
};

export default MultidisciplinaryTopicWrapper;
