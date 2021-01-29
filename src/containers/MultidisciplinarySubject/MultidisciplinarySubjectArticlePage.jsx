/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '@ndla/ui/lib/Spinner';
import { useGraphQuery } from '../../util/runQueries';
import { topicQueryWithPathTopics } from '../../queries';
import { getUrnIdsFromProps } from '../../routeHelpers';
import MultidisciplinarySubjectArticle from './components/MultidisciplinarySubjectArticle';
import config from '../../config';

const MultidisciplinarySubjectArticlePage = ({ match, locale }) => {
  const { topicId, subjectId } = getUrnIdsFromProps({ match });

  const { data, loading } = useGraphQuery(topicQueryWithPathTopics, {
    variables: { topicId, subjectId },
  });

  if (loading) {
    return <Spinner />;
  }
  
  const { topic, subject, resourceTypes } = data;
  const copyPageUrlLink = config.ndlaFrontendDomain + topic.path;

  return (
    <MultidisciplinarySubjectArticle
      topic={topic}
      subject={subject}
      resourceTypes={resourceTypes}
      copyPageUrlLink={copyPageUrlLink}
      locale={locale}
    />
  );
};

MultidisciplinarySubjectArticlePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string.isRequired,
      subjectId: PropTypes.string.isRequired,
    }).isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  locale: PropTypes.string,
};

export default MultidisciplinarySubjectArticlePage;
