/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext } from 'react';
import { ContentPlaceholder } from '@ndla/ui';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useGraphQuery } from '../../util/runQueries';
import { useUrnIds } from '../../routeHelpers';
import MultidisciplinarySubjectArticle, {
  multidisciplinarySubjectArticleFragments,
} from './components/MultidisciplinarySubjectArticle';
import {
  GQLMultidisciplinarySubjectArticlePageQuery,
  GQLMultidisciplinarySubjectArticlePageQueryVariables,
} from '../../graphqlTypes';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { htmlTitle } from '../../util/titleHelper';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { AuthContext } from '../../components/AuthenticationContext';
import { SKIP_TO_CONTENT_ID } from '../../constants';

const multidisciplinarySubjectArticlePageQuery = gql`
  query multidisciplinarySubjectArticlePage(
    $topicId: String!
    $subjectId: String!
    $convertEmbeds: Boolean
  ) {
    subject(id: $subjectId) {
      ...MultidisciplinarySubjectArticle_Subject
    }
    topic(id: $topicId, subjectId: $subjectId) {
      id
      article(showVisualElement: "true", convertEmbeds: $convertEmbeds) {
        metaDescription
        tags
        metaImage {
          url
        }
      }
      ...MultidisciplinarySubjectArticle_Topic
    }
    resourceTypes {
      ...MultidisciplinarySubjectArticle_ResourceTypeDefinition
    }
  }
  ${multidisciplinarySubjectArticleFragments.resourceType}
  ${multidisciplinarySubjectArticleFragments.topic}
  ${multidisciplinarySubjectArticleFragments.subject}
`;

const MultidisciplinarySubjectArticlePage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { topicId, subjectId } = useUrnIds();

  const { data, loading } = useGraphQuery<
    GQLMultidisciplinarySubjectArticlePageQuery,
    GQLMultidisciplinarySubjectArticlePageQueryVariables
  >(multidisciplinarySubjectArticlePageQuery, {
    variables: {
      topicId: topicId!,
      subjectId: subjectId!,
      convertEmbeds: true,
    },
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (!data?.topic || !data?.subject) {
    return <DefaultErrorMessage />;
  }

  const { topic, subject, resourceTypes } = data;

  const socialMediaMetaData = {
    title: htmlTitle(topic.name ?? topic.article?.title, [subject.name]),
    description: topic.article?.metaDescription ?? topic.article?.introduction,
    image: topic.article?.metaImage,
  };

  return (
    <>
      <Helmet>
        <title>
          {htmlTitle(socialMediaMetaData.title, [
            t('htmlTitles.titleTemplate'),
          ])}
        </title>
      </Helmet>
      <SocialMediaMetadata
        title={socialMediaMetaData.title}
        description={socialMediaMetaData.description}
        imageUrl={socialMediaMetaData.image?.url}
        trackableContent={{
          supportedLanguages: topic.article?.supportedLanguages,
          tags: topic.article?.tags,
        }}
      />
      <MultidisciplinarySubjectArticle
        skipToContentId={SKIP_TO_CONTENT_ID}
        topic={topic}
        subject={subject}
        resourceTypes={resourceTypes}
        user={user}
      />
    </>
  );
};

export default MultidisciplinarySubjectArticlePage;
