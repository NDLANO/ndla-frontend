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

import { topicPageQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import ArticleContents from '../../../components/Article/ArticleContents';
import Resources from '../../Resources/Resources';

const MainTopic = ({
  topicId,
  subTopicId,
  subjectId,
  filterIds,
  setSelectedSubTopic,
  locale,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [showResources, setShowResources] = useState(true);

  useEffect(() => {
    setShowContent(false);
    setShowResources(true);
  }, [topicId]);

  const { data, loading } = useGraphQuery(topicPageQuery, {
    variables: { topicId, subjectId, filterIds },
    onCompleted: data => subTopicId && setSelectedSubTopic(data.topic)
  });

  if (loading) {
    return <Spinner />;
  }

  const topic = data.topic;
  const resourceTypes = data.resourceTypes;
  const subTopics = topic.subtopics.map(item => ({
    id: item.id,
    label: item.name,
  }));

  const onClickSubTopic = e => {
    e.preventDefault();
    const topic = subTopics.find(
      topic => topic.label === e.currentTarget.textContent,
    );
    setSelectedSubTopic(topic);
    setShowResources(false);
  };

  return (
    <>
      <NavigationTopicAbout
        heading={topic.name}
        ingress={topic.article?.introduction}
        showContent={showContent}
        onToggleShowContent={() => setShowContent(!showContent)}>
        <ArticleContents article={topic.article} locale={locale} />
      </NavigationTopicAbout>
      {subTopics.length !== 0 && (
        <NavigationBox
          colorMode="light"
          heading="emner"
          items={subTopics}
          onClick={onClickSubTopic}
        />
      )}
      {showResources && 
        <Resources
          title={topic.name}
          resourceTypes={resourceTypes}
          coreResources={topic.coreResources}
          supplementaryResources={topic.supplementaryResources}
          locale={locale}
        />
      }
    </>
  );
};

MainTopic.propTypes = {
  topicId: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
  filterIds: PropTypes.string,
  setSelectedSubTopic: PropTypes.func,
  locale: PropTypes.string,
};

export default MainTopic;
