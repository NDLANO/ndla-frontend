/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext } from 'react';
import { Navigate, useLocation, Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentPlaceholder } from '@ndla/ui';

import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { useUrnIds } from '../../routeHelpers';
import { getTopicPath } from '../../util/getTopicPath';
import { isLearningPathResource } from '../Resources/resourceHelpers';
import LearningpathPage, {
  learningpathPageFragments,
} from '../LearningpathPage/LearningpathPage';
import ArticlePage, { articlePageFragments } from '../ArticlePage/ArticlePage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import MovedResourcePage from '../MovedResourcePage/MovedResourcePage';
import { useGraphQuery } from '../../util/runQueries';
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from '../../constants';
import { isAccessDeniedError } from '../../util/handleError';
import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';
import { GQLResource, GQLResourcePageQuery } from '../../graphqlTypes';
import { AuthContext } from '../../components/AuthenticationContext';
import RedirectContext, {
  RedirectInfo,
} from '../../components/RedirectContext';
import config from '../../config';

const urlInPaths = (
  location: Location,
  resource: Pick<GQLResource, 'paths'>,
) => {
  return resource.paths?.find(p => location.pathname.includes(p));
};

const resourcePageQuery = gql`
  query resourcePage(
    $topicId: String!
    $subjectId: String!
    $resourceId: String!
    $convertEmbeds: Boolean
  ) {
    subject(id: $subjectId) {
      topics(all: true) {
        parent
        ...LearningpathPage_TopicPath
        ...ArticlePage_TopicPath
      }
      ...LearningpathPage_Subject
      ...ArticlePage_Subject
    }
    resourceTypes {
      ...ArticlePage_ResourceType
      ...LearningpathPage_ResourceTypeDefinition
    }
    topic(id: $topicId, subjectId: $subjectId) {
      ...LearningpathPage_Topic
      ...ArticlePage_Topic
    }
    resource(id: $resourceId, subjectId: $subjectId, topicId: $topicId) {
      relevanceId
      paths
      ...MovedResourcePage_Resource
      ...ArticlePage_Resource
      ...LearningpathPage_Resource
    }
  }
  ${articlePageFragments.topic}
  ${MovedResourcePage.fragments.resource}
  ${articlePageFragments.resource}
  ${articlePageFragments.resourceType}
  ${articlePageFragments.subject}
  ${articlePageFragments.topicPath}
  ${learningpathPageFragments.topic}
  ${learningpathPageFragments.resourceType}
  ${learningpathPageFragments.resource}
  ${learningpathPageFragments.subject}
  ${learningpathPageFragments.topicPath}
`;
const ResourcePage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { subjectId, resourceId, topicId, stepId } = useUrnIds();
  const location = useLocation();
  const { error, loading, data } = useGraphQuery<GQLResourcePageQuery>(
    resourcePageQuery,
    {
      variables: {
        subjectId,
        topicId,
        resourceId,
        convertEmbeds: !config.articleConverterEnabled,
      },
    },
  );
  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (isAccessDeniedError(error)) {
    return <AccessDeniedPage />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (!data.resource || !data.resource.path) {
    return <NotFoundPage />;
  }

  if (data.resource && !urlInPaths(location, data.resource)) {
    if (data.resource.paths?.length === 1) {
      if (typeof window === 'undefined') {
        if (redirectContext) {
          redirectContext.status = 301;
          redirectContext.url = data.resource.paths[0]!;
          return null;
        }
      } else {
        return <Navigate to={data.resource.paths[0]!} replace />;
      }
    } else {
      return <MovedResourcePage resource={data.resource} />;
    }
  }

  const { subject, resource, topic } = data;
  const relevanceId = resource.relevanceId;
  const relevance =
    relevanceId === RELEVANCE_SUPPLEMENTARY
      ? t('searchPage.searchFilterMessages.supplementaryRelevance')
      : t('searchPage.searchFilterMessages.coreRelevance');
  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  if (isLearningPathResource(resource)) {
    return (
      <LearningpathPage
        skipToContentId={SKIP_TO_CONTENT_ID}
        stepId={stepId}
        user={user}
        data={{ ...data, relevance, topicPath }}
        loading={loading}
      />
    );
  }
  return (
    <ArticlePage
      skipToContentId={SKIP_TO_CONTENT_ID}
      resource={data.resource}
      topic={data.topic}
      topicPath={topicPath}
      relevance={relevance}
      subject={data.subject}
      resourceTypes={data.resourceTypes}
      errors={error?.graphQLErrors}
      loading={loading}
      user={user}
    />
  );
};

export default ResourcePage;
