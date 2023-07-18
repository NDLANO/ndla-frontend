/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { gql } from '@apollo/client';
import { withTracker } from '@ndla/tracker';
import { FeideUserApiType, Topic as UITopic, TopicProps } from '@ndla/ui';
import { useEffect, useMemo, useState } from 'react';
import { Remarkable } from 'remarkable';
import { CustomWithTranslation, withTranslation } from 'react-i18next';

import ArticleContents from '../../../components/Article/ArticleContents';
import VisualElementWrapper, {
  getResourceType,
} from '../../../components/VisualElement/VisualElementWrapper';
import {
  GQLMultidisciplinaryTopic_SubjectFragment,
  GQLMultidisciplinaryTopic_TopicFragment,
} from '../../../graphqlTypes';
import { toTopic, useIsNdlaFilm, useUrnIds } from '../../../routeHelpers';
import { getCrop, getFocalPoint } from '../../../util/imageHelpers';
import { htmlTitle } from '../../../util/titleHelper';
import { getAllDimensions } from '../../../util/trackingUtil';
import Resources from '../../Resources/Resources';
import { SKIP_TO_CONTENT_ID } from '../../../constants';

interface Props extends CustomWithTranslation {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  subject: GQLMultidisciplinaryTopic_SubjectFragment;
  topic: GQLMultidisciplinaryTopic_TopicFragment;
  loading?: boolean;
  disableNav?: boolean;
  user?: FeideUserApiType;
}

const getDocumentTitle = ({ t, topic }: Props) => {
  return htmlTitle(topic.name, [t('htmlTitles.titleTemplate')]);
};

const MultidisciplinaryTopic = ({
  topicId,
  subjectId,
  subTopicId,
  topic,
  disableNav,
}: Props) => {
  const [showContent, setShowContent] = useState(false);
  const ndlaFilm = useIsNdlaFilm();
  const { topicList } = useUrnIds();

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);
  const renderMarkdown = (text: string) => markdown.render(text);

  const topicPath = topic.path
    ?.split('/')
    .slice(2)
    .map((id) => `urn:${id}`);
  const subTopics =
    topic.subtopics?.map((item) => ({
      id: item.id,
      label: item.name,
      selected: item.id === subTopicId,
      url: toTopic(subjectId, ...(topicPath ?? []), item.id),
    })) ?? [];

  const toTopicProps = (
    article: GQLMultidisciplinaryTopic_TopicFragment['article'],
  ): TopicProps | undefined => {
    if (!article) return;
    const image =
      article?.visualElement?.resource === 'image' &&
      article.visualElement.image
        ? {
            url: article.visualElement.image?.src ?? '',
            alt: article.visualElement.image?.alt ?? '',
            crop: getCrop(article.visualElement.image),
            focalPoint: getFocalPoint(article.visualElement.image),
          }
        : {
            url: article?.metaImage?.url ?? '',
            alt: article?.metaImage?.alt ?? '',
          };
    return {
      topic: {
        title: article.title,
        introduction: article.introduction ?? '',
        image,
        visualElement: article.visualElement
          ? {
              type: getResourceType(article.visualElement.resource),
              element: (
                <VisualElementWrapper visualElement={article.visualElement} />
              ),
            }
          : undefined,
      },
    };
  };

  const { article } = topic;

  return (
    <UITopic
      id={
        topicId === topicList[topicList.length - 1]
          ? SKIP_TO_CONTENT_ID
          : undefined
      }
      onToggleShowContent={
        article?.content !== '' ? () => setShowContent(!showContent) : undefined
      }
      showContent={showContent}
      topic={toTopicProps(article)?.topic}
      subTopics={!disableNav ? subTopics : undefined}
      isLoading={false}
      renderMarkdown={renderMarkdown}
      invertedStyle={ndlaFilm}
    >
      <ArticleContents
        topic={topic}
        modifier="in-topic"
        showIngress={false}
        subjectId={subjectId}
      />
    </UITopic>
  );
};

export const multidisciplinaryTopicFragments = {
  topic: gql`
    fragment MultidisciplinaryTopic_Topic on Topic {
      path
      subtopics {
        id
        name
      }
      article(convertEmbeds: $convertEmbeds) {
        metaImage {
          url
          alt
        }
        visualElement {
          ...VisualElementWrapper_VisualElement
        }
      }
      ...ArticleContents_Topic
      ...Resources_Topic
    }
    ${VisualElementWrapper.fragments.visualElement}
    ${Resources.fragments.topic}
    ${ArticleContents.fragments.topic}
  `,
  subject: gql`
    fragment MultidisciplinaryTopic_Subject on Subject {
      id
      name
      allTopics {
        id
        name
      }
    }
  `,
};

MultidisciplinaryTopic.getDocumentTitle = getDocumentTitle;

MultidisciplinaryTopic.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  const { topic } = currentProps;
  if (topic.article) {
    trackPageView(currentProps);
  }
};

MultidisciplinaryTopic.getDimensions = (props: Props) => {
  const { topic, subject, user } = props;
  const topicPath = topic.path
    ?.split('/')
    .slice(2)
    .map(
      (t) =>
        subject.allTopics?.find((topic) => topic.id.replace('urn:', '') === t),
    );

  return getAllDimensions(
    {
      subject,
      topicPath,
      article: topic.article,
      filter: subject.name,
      user,
    },
    undefined,
    true,
  );
};

export default withTranslation()(withTracker(MultidisciplinaryTopic));
