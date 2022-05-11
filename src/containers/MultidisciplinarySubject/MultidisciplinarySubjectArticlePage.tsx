/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ContentPlaceholder } from '@ndla/ui';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useGraphQuery } from '../../util/runQueries';
import { getUrnIdsFromProps } from '../../routeHelpers';
import MultidisciplinarySubjectArticle, {
  multidisciplinarySubjectArticleFragments,
} from './components/MultidisciplinarySubjectArticle';
import config from '../../config';
import {
  GQLMultidisciplinarySubjectArticlePageQuery,
  GQLMultidisciplinarySubjectArticlePageQueryVariables,
} from '../../graphqlTypes';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { htmlTitle } from '../../util/titleHelper';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { RootComponentProps } from '../../routes';
import { AuthContext } from '../../components/AuthenticationContext';

interface Props extends RootComponentProps, RouteComponentProps {}

const multidisciplinarySubjectArticlePageQuery = gql`
  query multidisciplinarySubjectArticlePage(
    $topicId: String!
    $subjectId: String!
  ) {
    subject(id: $subjectId) {
      ...MultidisciplinarySubjectArticle_Subject
    }
    topic(id: $topicId, subjectId: $subjectId) {
      id
      article(showVisualElement: "true") {
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

const MultidisciplinarySubjectArticlePage = ({
  match,
  locale,
  skipToContentId,
}: Props) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { topicId, subjectId } = getUrnIdsFromProps({ match });

  const { data, loading } = useGraphQuery<
    GQLMultidisciplinarySubjectArticlePageQuery,
    GQLMultidisciplinarySubjectArticlePageQueryVariables
  >(multidisciplinarySubjectArticlePageQuery, {
    variables: {
      topicId: topicId!,
      subjectId: subjectId!,
    },
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (!data?.topic || !data?.subject) {
    return <DefaultErrorMessage />;
  }

  const { topic, subject, resourceTypes } = data;
  const copyPageUrlLink = topic?.path && config.ndlaFrontendDomain + topic.path;

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
        {socialMediaMetaData.description && (
          <meta name="description" content={socialMediaMetaData.description} />
        )}
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
        skipToContentId={skipToContentId}
        topic={topic}
        subject={subject}
        resourceTypes={resourceTypes}
        copyPageUrlLink={copyPageUrlLink}
        locale={locale}
        user={user}
      />
    </>
  );
};

export default withRouter(MultidisciplinarySubjectArticlePage);
