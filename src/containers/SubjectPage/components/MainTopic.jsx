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

import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import ArticleContents from '../../../components/Article/ArticleContents';
import Resources from '../../Resources/Resources';
import { toTopic } from '../../../routeHelpers';

const MainTopic = ({
  topicId,
  subjectId,
  filterIds,
  setSelectedTopic,
  showResources,
  locale,
  subTopicId,
  ndlaFilm,
  onClickTopics,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId, filterIds },
    onCompleted: data =>
      setSelectedTopic({
        id: data.topic.id,
        label: data.topic.name,
      }),
  });

  if (loading) {
    return <Spinner />;
  }

  const topic = data.topic;
  const resourceTypes = data.resourceTypes;
  const subTopics = topic.subtopics.map(item => ({
    id: item.id,
    label: item.name,
    selected: item.id === subTopicId,
    url: toTopic(subjectId, filterIds, topicId, item.id),
  }));

  return (
    <>
      <NavigationTopicAbout
        heading={topic.name}
        ingress={topic.article?.introduction}
        showContent={showContent}
        invertedStyle={ndlaFilm}
        onToggleShowContent={() => setShowContent(!showContent)}
        children={
          <ArticleContents
            article={topic.article}
            locale={locale}
            modifier="in-topic"
          />
        }
      />
      {subTopics.length !== 0 && (
        <NavigationBox
          colorMode="light"
          heading="emner"
          items={subTopics}
          listDirection="horizontal"
          invertedStyle={ndlaFilm}
          onClick={e => {
            onClickTopics(e, subTopics)
          }}
        />
      )}
      {showResources && (
        <Resources
          topic={topic}
          resourceTypes={resourceTypes}
          locale={locale}
          ndlaFilm={ndlaFilm}
        />
      )}
    </>
  );
};

MainTopic.propTypes = {
  topicId: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
  filterIds: PropTypes.string,
  setSelectedTopic: PropTypes.func,
  showResources: PropTypes.bool,
  subTopicId: PropTypes.string,
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  onClickTopics: PropTypes.func,
};

export default MainTopic;
