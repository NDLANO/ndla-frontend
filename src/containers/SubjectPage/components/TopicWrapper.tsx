import React, { useState } from 'react';
import Spinner from '@ndla/ui/lib/Spinner';
import {
  ArticleByline,
  ArticleContent,
  ArticleHeaderWrapper,
  ArticleIntroduction,
  ArticleWrapper,
  Topic,
} from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { TopicProps } from '@ndla/ui/lib/Topic/Topic';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import { BreadcrumbItem, LocaleType } from '../../../interfaces';
import { GQLResourceType, GQLSubject, GQLTopic } from '../../../graphqlTypes';
import Resources from '../../Resources/Resources';
import { toTopic } from '../../../routeHelpers';
import VisualElementContent, {
  resourceType,
} from '../../../components/VisualElement/VisualElementContent';
import LicenseBox from '../../../components/license/LicenseBox';
interface Props {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  ndlaFilm?: boolean;
  onClickTopics: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  setBreadCrumb: (item: BreadcrumbItem) => void;
  index: number;
  showResources: boolean;
  subject: GQLSubject & { allTopics: GQLTopic[] };
}

interface Data {
  topic: GQLTopic;
  resourceTypes: GQLResourceType;
}

const TopicWrapper = ({
  subTopicId,
  topicId,
  subjectId,
  locale,
  onClickTopics,
  setBreadCrumb,
  index,
}: Props & tType) => {
  const [showContent, setShowContent] = useState(false);

  const { data, loading } = useGraphQuery<Data>(topicQuery, {
    variables: { topicId, subjectId },
    onCompleted: data => {
      setBreadCrumb({
        id: data.topic.id,
        label: data.topic.name,
        index: index,
        url: '',
      });
    },
  });

  if (loading || !data?.topic?.subtopics || !data.topic.article) {
    return <Spinner />;
  }

  const { article } = data.topic;

  const transposedTopic: TopicProps = {
    topic: {
      title: article.title,
      introduction: article.introduction!,
      image: { url: article.metaImage?.url!, alt: article?.metaImage?.alt! },
      visualElement: {
        type: resourceType(article.visualElement?.resource),
        element: <VisualElementContent topic={data.topic} locale={locale} />,
      },
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

  const subTopics = data.topic?.subtopics?.map((subtopic: GQLTopic) => {
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === subTopicId,
      url: toTopic(subjectId, topicId, subtopic.id),
    };
  });

  return (
    <Topic
      onToggleShowContent={() => setShowContent(!showContent)}
      showContent={showContent}
      topic={transposedTopic.topic}
      subTopics={subTopics}
      isLoading={loading}
      onSubTopicSelected={(e: React.MouseEvent<HTMLElement>) =>
        onClickTopics(e as React.MouseEvent<HTMLAnchorElement>)
      }>
      <ArticleWrapper id={topicId} modifier="in-topic">
        <ArticleHeaderWrapper>
          <ArticleIntroduction renderMarkdown={text => text}>
            {data.topic.article.introduction}
          </ArticleIntroduction>
        </ArticleHeaderWrapper>
        <ArticleContent locale={locale} content={data.topic.article.content} />
        <ArticleByline
          licenseBox={
            <LicenseBox article={data.topic.article} locale={locale} />
          }
          {...{
            authors: data.topic.article.copyright.creators,
            published: data.topic.article.published,
            license: data.topic.article.copyright.license?.license!,
          }}
        />
      </ArticleWrapper>
    </Topic>
  );
};
//Articlewrapper setupen er hentet fra <Article>, bruker du Article komponenten så skjer det ett eller annet
// så den bare overgår containeren sin. Selv om Article komponenten er akkurat det samme som vist over her.
export default injectT(TopicWrapper);
