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
import Resources from '../../Resources/Resources';
import { toTopic } from '../../../routeHelpers';
import { getAllDimensions } from '../../../util/trackingUtil';
import { getSubjectBySubjectIdFilters } from '../../../data/subjects';
import {
  GraphQLResourceTypeShape,
  GraphQLSubjectShape,
  GraphQLTopicShape,
} from '../../../graphqlShapes';

const getDocumentTitle = ({ t, data }) => {
  return `${data?.topic?.name || ''}${t('htmlTitles.titleTemplate')}`;
};

const Topic = ({
  topicId,
  subjectId,
  filterIds,
  locale,
  subTopicId,
  ndlaFilm,
  onClickTopics,
  showResources,
  data,
}) => {
  const [showContent, setShowContent] = useState(false);
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);
  const renderMarkdown = text => markdown.render(text);

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  const topic = data.topic;
  const topicPath = topic.path
    .split('/')
    .slice(2)
    .map(id => `urn:${id}`);
  const resourceTypes = data.resourceTypes;
  const subTopics = topic.subtopics.map(item => ({
    id: item.id,
    label: item.name,
    selected: item.id === subTopicId,
    url: toTopic(subjectId, filterIds, ...topicPath, item.id),
  }));
  const filterParam = filterIds ? `?filters=${filterIds}` : '';
  const copyPageUrlLink = config.ndlaFrontendDomain + topic.path + filterParam;

  return (
    <>
      <NavigationTopicAbout
        heading={topic.name}
        introduction={topic.article?.introduction}
        showContent={showContent}
        renderMarkdown={renderMarkdown}
        invertedStyle={ndlaFilm}
        onToggleShowContent={() => setShowContent(!showContent)}
        isLoading={false}
        children={
          <ArticleContents
            topic={topic}
            copyPageUrlLink={copyPageUrlLink}
            locale={locale}
            modifier="in-topic"
            showIngress={false}
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
            onClickTopics(e);
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

Topic.getDocumentTitle = getDocumentTitle;

Topic.willTrackPageView = (trackPageView, currentProps) => {
  const { data, loading, showResources } = currentProps;
  if (showResources && !loading && data?.topic?.article) {
    trackPageView(currentProps);
  }
};

Topic.getDimensions = props => {
  const { filterIds, data, locale, subject } = props;
  const topicPath = data.topic.path
    .split('/')
    .slice(2)
    .map(t =>
      subject.allTopics.find(topic => topic.id.replace('urn:', '') === t),
    );

  const subjectBySubjectIdFiltes = getSubjectBySubjectIdFilters(
    subject.id,
    filterIds.split(','),
  );
  const longName = subjectBySubjectIdFiltes?.longName[locale];

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

Topic.propTypes = {
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
  data: PropTypes.shape({
    topic: GraphQLTopicShape,
    resourceTypes: PropTypes.arrayOf(GraphQLResourceTypeShape),
  }),
  loading: PropTypes.bool,
};

export default injectT(withTracker(Topic));
