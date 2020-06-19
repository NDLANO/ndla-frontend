/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavigationTopicAbout } from '@ndla/ui';

import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import ArticleContents from '../../../components/Article/ArticleContents';

const MainTopic = ({ topicId, subjectId, filterIds, locale }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
  }, [topicId])

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId, filterIds }
  })

  const topic = data?.topic;

  return (
    <NavigationTopicAbout
      heading={topic?.name}
      ingress={topic?.article?.introduction}
      showContent={showContent}
      onToggleShowContent={() => setShowContent(!showContent)}
      isLoading={loading}>
      <ArticleContents
        article={topic?.article}
        locale={locale}
      />
    </NavigationTopicAbout>
  );
}

MainTopic.propTypes = {
  topicId: PropTypes.string,
  subjectId: PropTypes.string,
  filterIds: PropTypes.string,
};

export default MainTopic;