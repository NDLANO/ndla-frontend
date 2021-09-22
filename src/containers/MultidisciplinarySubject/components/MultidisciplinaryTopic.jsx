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
import { Topic as UITopic } from '@ndla/ui';
import { TopicProps } from '@ndla/ui/lib/Topic/Topic';
import { withTracker } from '@ndla/tracker';
import { withTranslation } from 'react-i18next';
import config from '../../../config';
import ArticleContents from '../../../components/Article/ArticleContents';
import { toTopic } from '../../../routeHelpers';
import { getAllDimensions } from '../../../util/trackingUtil';
import { htmlTitle } from '../../../util/titleHelper';
import { getCrop, getFocalPoint } from '../../../util/imageHelpers';
import { getSubjectLongName } from '../../../data/subjects';
import Resources from '../../Resources/Resources';
import VisualElementWrapper, {
  getResourceType,
} from '../../../components/VisualElement/VisualElementWrapper';
import {
  GraphQLResourceTypeShape,
  GraphQLSubjectShape,
  GraphQLTopicShape,
} from '../../../graphqlShapes';

const getDocumentTitle = ({ t, data }) => {
  return htmlTitle(data?.topic?.name, [t('htmlTitles.titleTemplate')]);
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

  const { article } = data.topic;
  const image =
    article.visualElement?.resource === 'image'
      ? {
          url: article.visualElement.image?.src,
          alt: article.visualElement.image?.alt,
          crop: getCrop(article.visualElement.image),
          focalPoint: getFocalPoint(article.visualElement.image),
        }
      : {
          url: article.metaImage?.url,
          alt: article?.metaImage?.alt,
        };
  const transposedTopic: TopicProps = {
    topic: {
      title: article.title,
      introduction: article.introduction,
      image,
      visualElement: article.visualElement
        ? {
            type: getResourceType(article.visualElement.resource),
            element: (
              <VisualElementWrapper
                visualElement={article.visualElement}
                locale={locale}
              />
            ),
          }
        : undefined,
      resources: data.topic.subtopics ? (
        <Resources
          topic={data.topic}
          resourceTypes={data.resourceTypes}
          locale={locale}
        />
      ) : (
        undefined
      ),
    },
  };

  return (
    <UITopic
      onToggleShowContent={
        article.content !== '' ? () => setShowContent(!showContent) : undefined
      }
      showContent={showContent}
      topic={transposedTopic.topic}
      subTopics={!disableNav && subTopics}
      isLoading={false}
      renderMarkdown={renderMarkdown}
      invertedStyle={ndlaFilm}>
      <ArticleContents
        topic={data.topic}
        copyPageUrlLink={copyPageUrlLink}
        locale={locale}
        modifier="in-topic"
        showIngress={false}
      />
    </UITopic>
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

  const longName = getSubjectLongName(subject?.id, locale);

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

export default withTranslation()(withTracker(MultidisciplinaryTopic));
