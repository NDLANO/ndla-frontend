/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';
import { NavigationTopicAbout, NavigationBox } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import config from '../../../config';
import ArticleContents from '../../../components/Article/ArticleContents';
import { toTopic } from '../../../routeHelpers';
import { getAllDimensions } from '../../../util/trackingUtil';
import { getSubjectBySubjectId } from '../../../data/subjects';
import {
  GraphQLResourceTypeShape,
  GraphQLSubjectShape,
  GraphQLTopicShape,
} from '../../../graphqlShapes';

const getDocumentTitle = ({ t, data }) => {
  return `${data?.topic?.name || ''}${t('htmlTitles.titleTemplate')}`;
};

const MultidisciplinaryTopic = ({
  topicId,
  subjectId,
  locale,
  subTopicId,
  ndlaFilm,
  data,
  disableNav,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);
  const renderMarkdown = text => markdown.render(text);

  const topic = data.topic;
  const topicPath = topic.path
    .split('/')
    .slice(2)
    .map(id => `urn:${id}`);
  const subTopics = topic.subtopics.map(item => ({
    id: item.id,
    label: item.name,
    selected: item.id === subTopicId,
    url: toTopic(subjectId, ...topicPath, item.id),
  }));
  const copyPageUrlLink = config.ndlaFrontendDomain + topic.path;

  return (
    <>
      <NavigationTopicAbout
        heading={topic.name}
        introduction={topic.article?.introduction}
        showContent={showContent}
        invertedStyle={ndlaFilm}
        renderMarkdown={renderMarkdown}
        onToggleShowContent={() => setShowContent(!showContent)}
        isLoading={false}>
        <ArticleContents
          topic={topic}
          copyPageUrlLink={copyPageUrlLink}
          locale={locale}
          modifier="in-topic"
          showIngress={false}
        />
      </NavigationTopicAbout>
      {subTopics.length !== 0 && disableNav !== true && (
        <NavigationBox
          colorMode="light"
          heading="emner"
          items={subTopics}
          listDirection="horizontal"
          invertedStyle={ndlaFilm}
        />
      )}
    </>
  );
};

MultidisciplinaryTopic.getDocumentTitle = getDocumentTitle;

MultidisciplinaryTopic.willTrackPageView = (trackPageView, currentProps) => {
  const { data } = currentProps;
  if (data?.topic?.article) {
    trackPageView(currentProps);
  }
};

MultidisciplinaryTopic.getDimensions = props => {
  const { data, locale, subject } = props;
  const topicPath = data.topic.path
    .split('/')
    .slice(2)
    .map(t =>
      subject.allTopics.find(topic => topic.id.replace('urn:', '') === t),
    );

  const subjectBySubjectId = getSubjectBySubjectId(subject.id);
  const longName = subjectBySubjectId?.longName[locale];

  return getAllDimensions(
    {
      subject: subject,
      topicPath,
      article: data.topic.article,
      filter: longName,
    },
    undefined,
    true,
  );
};

MultidisciplinaryTopic.propTypes = {
  topicId: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
  setSelectedTopic: PropTypes.func,
  subTopicId: PropTypes.string,
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  setBreadCrumb: PropTypes.func,
  index: PropTypes.number,
  subject: GraphQLSubjectShape,
  data: PropTypes.shape({
    topic: GraphQLTopicShape,
    resourceTypes: PropTypes.arrayOf(GraphQLResourceTypeShape),
  }),
  loading: PropTypes.bool,
  disableNav: PropTypes.bool,
};

export default injectT(withTracker(MultidisciplinaryTopic));
