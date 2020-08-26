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

const SubTopic = ({
  topicId,
  subjectId,
  filterIds,
  setSelectedSubTopic,
  locale,
  ndlaFilm,
  subTopicId,
  setSubSubTopicId,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId, filterIds },
    onCompleted: data =>
      setSelectedSubTopic({
        id: data.topic.id,
        label: data.topic.name,
      }),
  });

  if (loading) {
    return <Spinner />;
  }

  const topic = data.topic;
  const subTopics = topic.subtopics.map(item => ({
    id: item.id,
    label: item.name,
    selected: item.id === subTopicId,
  }));
  const resourceTypes = data.resourceTypes;

  const onClickSubTopic = e => {
    e.preventDefault();
    const topic = subTopics.find(
      topic => topic.label === e.currentTarget.textContent,
    );
    setSubSubTopicId(topic.id);
  };

  return (
    <>
      <NavigationTopicAbout
        heading={topic.name}
        invertedStyle={ndlaFilm}
        ingress={topic.article?.introduction}
        showContent={showContent}
        onToggleShowContent={() => setShowContent(!showContent)}>
        <ArticleContents
          article={topic.article}
          locale={locale}
          modifier="in-topic"
        />
      </NavigationTopicAbout>
      {subTopics.length !== 0 && (
        <NavigationBox
          colorMode="light"
          heading="emner"
          items={subTopics}
          listDirection="horizontal"
          onClick={onClickSubTopic}
          invertedStyle={ndlaFilm}
          isButtonElements
        />
      )}
      <Resources
        title={topic.name}
        resourceTypes={resourceTypes}
        coreResources={topic.coreResources}
        supplementaryResources={topic.supplementaryResources}
        locale={locale}
        ndlaFilm={ndlaFilm}
      />
    </>
  );
};

SubTopic.propTypes = {
  topicId: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
  filterIds: PropTypes.string,
  setSelectedSubTopic: PropTypes.func,
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  setSubSubTopicId: PropTypes.func,
  subTopicId: PropTypes.string,
};

export default SubTopic;
