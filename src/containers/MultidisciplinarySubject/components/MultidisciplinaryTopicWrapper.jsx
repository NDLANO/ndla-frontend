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
  locale,
  subTopicId,
  ndlaFilm,
  index,
  subject,
  disableNav,
}) => {
  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId },
  });

  if (loading) {
    return <Spinner />;
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

MultidisciplinaryTopicWrapper.propTypes = {
  topicId: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
  setSelectedTopic: PropTypes.func,
  subTopicId: PropTypes.string,
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  index: PropTypes.number,
  subject: GraphQLSubjectShape,
  disableNav: PropTypes.bool,
};

export default MultidisciplinaryTopicWrapper;
