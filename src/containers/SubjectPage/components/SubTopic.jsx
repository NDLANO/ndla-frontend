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
import { toSubjects } from '../../../routeHelpers';
import config from '../../../config';

const SubTopic = ({
  topicId,
  subjectId,
  filterIds,
  locale,
  ndlaFilm,
  subSubTopicId,
  onClickTopics,
  setBreadCrumb,
  index,
  topics,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId, filterIds },
    onCompleted: data =>
      setBreadCrumb(
        {
          id: data.topic.id,
          label: data.topic.name,
        },
        index,
      ),
  });

  if (loading) {
    return <Spinner />;
  }

  const topic = data.topic;
  const subTopics = topic.subtopics.map(item => ({
    id: item.id,
    label: item.name,
    selected: item.id === subSubTopicId,
    url: toTopic(subjectId, filterIds, ...topics, item.id),
  }));
  const resourceTypes = data.resourceTypes;
  const filterParam = filterIds ? `?filters=${filterIds}` : ';';
  const copyPageUrlLink =
    config.ndlaFrontendDomain + toSubjects() + topic.path + filterParam;

  return (
    <>
      <NavigationTopicAbout
        heading={topic.name}
        invertedStyle={ndlaFilm}
        ingress={topic.article?.introduction}
        showContent={showContent}
        onToggleShowContent={() => setShowContent(!showContent)}>
        <ArticleContents
          topic={topic}
          copyPageUrlLink={copyPageUrlLink}
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
          invertedStyle={ndlaFilm}
          onClick={e => {
            onClickTopics(e);
          }}
        />
      )}
      <Resources
        topic={topic}
        resourceTypes={resourceTypes}
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
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  subSubTopicId: PropTypes.string,
  onClickTopics: PropTypes.func,
  setBreadCrumb: PropTypes.func,
  index: PropTypes.number,
  topics: PropTypes.arrayOf(PropTypes.string),
};

export default SubTopic;
