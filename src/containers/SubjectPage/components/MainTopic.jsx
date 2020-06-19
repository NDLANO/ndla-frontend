/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavigationTopicAbout, NavigationBox } from '@ndla/ui';
import Spinner from '@ndla/ui/lib/Spinner';

import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import ArticleContents from '../../../components/Article/ArticleContents';

const MainTopic = ({ topicId, subjectId, filterIds, locale }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
  }, [topicId])

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId }
  })

  if (loading) {
    return <Spinner/>;
  }

  const topic = data.topic;
  const subTopics = topic.subtopics.map(item => ({
    id: item.id,
    label: item.name,
  }))

  return (
    <>
      <NavigationTopicAbout
        heading={topic.name}
        ingress={topic.article?.introduction}
        showContent={showContent}
        onToggleShowContent={() => setShowContent(!showContent)}>
        <ArticleContents
          article={topic.article}
          locale={locale}
        />
      </NavigationTopicAbout>
      {(subTopics.length !== 0) &&
        <NavigationBox
          colorMode='light'
          heading='emner'
          items={subTopics}
        />
      }
    </>
  );
}

MainTopic.propTypes = {
  topicId: PropTypes.string,
  subjectId: PropTypes.string,
  filterIds: PropTypes.string,
};

export default MainTopic;