/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { Remarkable } from 'remarkable';
import { Topic as UITopic } from '@ndla/ui';
import { TopicProps } from '@ndla/ui/lib/Topic/Topic';
import { withTracker } from '@ndla/tracker';
import { WithTranslation, withTranslation } from 'react-i18next';
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
  GQLMultidisciplinaryTopic_SubjectFragment,
  GQLMultidisciplinaryTopic_TopicFragment,
  GQLResourceTypeDefinition,
} from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';
import { FeideUserWithGroups } from '../../../util/feideApi';

interface Props extends WithTranslation {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  ndlaFilm?: boolean;
  subject: GQLMultidisciplinaryTopic_SubjectFragment;
  topic: GQLMultidisciplinaryTopic_TopicFragment;
  resourceTypes?: GQLResourceTypeDefinition[];
  loading?: boolean;
  disableNav?: boolean;
  user?: FeideUserWithGroups;
}

const getDocumentTitle = ({ t, topic }: Props) => {
  return htmlTitle(topic.name, [t('htmlTitles.titleTemplate')]);
};

const MultidisciplinaryTopic = ({
  topicId,
  subjectId,
  locale,
  subTopicId,
  ndlaFilm,
  topic,
  resourceTypes,
  disableNav,
}: Props) => {
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
  const renderMarkdown = (text: string) => markdown.render(text);

  const topicPath = topic.path
    ?.split('/')
    .slice(2)
    .map(id => `urn:${id}`);
  const subTopics =
    topic.subtopics?.map(item => ({
      id: item.id,
      label: item.name,
      selected: item.id === subTopicId,
      url: toTopic(subjectId, ...(topicPath ?? []), item.id),
    })) ?? [];
  const copyPageUrlLink = config.ndlaFrontendDomain + topic.path;

  const toTopicProps = (
    article: GQLMultidisciplinaryTopic_TopicFragment['article'],
    locale: LocaleType,
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
                <VisualElementWrapper
                  visualElement={article.visualElement}
                  locale={locale}
                />
              ),
            }
          : undefined,
        resources: topic.subtopics ? (
          <Resources topic={topic} resourceTypes={resourceTypes} />
        ) : (
          undefined
        ),
      },
    };
  };

  const { article } = topic;

  return (
    <UITopic
      onToggleShowContent={
        article?.content !== '' ? () => setShowContent(!showContent) : undefined
      }
      showContent={showContent}
      topic={toTopicProps(article, locale)?.topic}
      subTopics={!disableNav ? subTopics : undefined}
      isLoading={false}
      renderMarkdown={renderMarkdown}
      invertedStyle={ndlaFilm}>
      <ArticleContents
        topic={topic}
        copyPageUrlLink={copyPageUrlLink}
        locale={locale}
        modifier="in-topic"
        showIngress={false}
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
      article {
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
  resourceType: gql`
    fragment MultidisciplinaryTopic_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
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
  const { topic, locale, subject, user } = props;
  const topicPath = topic.path
    ?.split('/')
    .slice(2)
    .map(t =>
      subject.allTopics?.find(topic => topic.id.replace('urn:', '') === t),
    );

  const longName = getSubjectLongName(subject?.id, locale);

  return getAllDimensions(
    {
      subject: subject,
      topicPath,
      article: topic.article,
      filter: longName,
      user,
    },
    undefined,
    true,
  );
};

export default withTranslation()(withTracker(MultidisciplinaryTopic));
