/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { subjectPageQuery, topicQuery } from '../../queries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import {
  GQLTopic,
  GQLSubject,
  GQLVisualElement,
  GQLArticle,
  GQLMetaImage,
  GQLResourceType,
} from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import ToolboxSubjectContainer from './ToolboxSubjectContainer';

interface ToolBoxArticleMetaImage extends Omit<GQLMetaImage, 'url' | 'alt'> {
  url: string;
  alt: string;
}
interface ToolBoxArticle
  extends Omit<GQLArticle, 'introduction' | 'metaImage' | 'visualElement'> {
  introduction: string;
  metaImage: ToolBoxArticleMetaImage;
  visualElement: GQLVisualElement;
}

export interface ToolBoxTopic extends Omit<GQLTopic, 'article'> {
  article: ToolBoxArticle;
}
interface Props extends RouteComponentProps {
  locale: LocaleType;
}

interface Data {
  subject: GQLSubject & { allTopics: GQLTopic[] };
}

export interface TopicData {
  topic: ToolBoxTopic;
  resourceTypes: GQLResourceType;
}

const ToolboxSubjectPage = ({ match, locale }: Props) => {
  const { subjectId, topicList } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });

  const [topicId, setTopicId] = useState<string | undefined>(topicList[0]);

  const { loading, data } = useGraphQuery<Data>(subjectPageQuery, {
    variables: {
      subjectId,
    },
  });

  const { loading: articleLoading, data: topicData } = useGraphQuery<TopicData>(
    topicQuery,
    {
      variables: {
        subjectId,
        topicId,
      },
      skip: !topicId,
    },
  );

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  return (
    <ToolboxSubjectContainer
      topicData={topicData}
      articleLoading={articleLoading}
      setTopicId={setTopicId}
      data={data}
      topicList={topicList}
      locale={locale}
    />
  );
};

export default withRouter(ToolboxSubjectPage);
