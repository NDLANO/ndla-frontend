/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Remarkable } from 'remarkable';
import { TFunction, WithTranslation } from 'react-i18next';
import { NavigationTopicAbout, NavigationBox } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import config from '../../../config';
import ArticleContents from '../../../components/Article/ArticleContents';
import Resources from '../../Resources/Resources';
import { toTopic } from '../../../routeHelpers';
import { getAllDimensions } from '../../../util/trackingUtil';
import { htmlTitle } from '../../../util/titleHelper';
import { getSubjectLongName } from '../../../data/subjects';
import { GQLResourceType, GQLSubject, GQLTopic } from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';

const getDocumentTitle = ({
  t,
  data,
}: {
  t: TFunction;
  data: Props['data'];
}) => {
  return htmlTitle(data?.topic?.name, [t('htmlTitles.titleTemplate')]);
};

interface Props extends Pick<WithTranslation, 't'> {
  topicId?: string;
  subjectId?: string;
  subTopicId?: string;
  locale?: LocaleType;
  ndlaFilm?: boolean;
  onClickTopics: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  index?: number;
  showResources?: boolean;
  subject?: GQLSubject & { allTopics: GQLTopic[] };
  loading?: boolean;
  data: {
    topic: GQLTopic;
    resourceTypes: Array<GQLResourceType>;
  };
}

const Topic = ({
  topicId,
  subjectId,
  locale,
  subTopicId,
  ndlaFilm,
  onClickTopics,
  showResources,
  data,
}: Props) => {
  const [showContent, setShowContent] = useState(false);
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);
  const renderMarkdown = (text: string) => markdown.render(text);

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  const topic = data.topic;

  const topicPath = topic?.path
    ?.split('/')
    .slice(2)
    .map(id => `urn:${id}`);
  const resourceTypes = data.resourceTypes;
  const subTopics = topic?.subtopics?.map(subtopic => ({
    id: subtopic?.id,
    label: subtopic?.name,
    selected: subtopic?.id === subTopicId,
    url: toTopic(subjectId!, ...topicPath!, subtopic?.id),
  }));
  const copyPageUrlLink = config.ndlaFrontendDomain + topic.path;

  return (
    <>
      <NavigationTopicAbout
        heading={topic.name}
        introduction={topic.article?.introduction || ''}
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
      {subTopics?.length !== 0 && (
        <NavigationBox
          colorMode="light"
          heading="emner"
          items={subTopics || []}
          listDirection="horizontal"
          invertedStyle={ndlaFilm}
          onClick={e => {
            onClickTopics(e as React.MouseEvent<HTMLAnchorElement>);
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

Topic.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  const { data, loading, showResources } = currentProps;
  if (showResources && !loading && data?.topic?.article) {
    trackPageView(currentProps);
  }
};

Topic.getDimensions = ({ data, locale, subject }: Props) => {
  const topicPath = data?.topic?.path
    ?.split('/')
    .slice(2)
    .map(t =>
      subject?.allTopics.find(topic => topic.id.replace('urn:', '') === t),
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

export default withTracker(Topic);
