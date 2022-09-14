/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { OneColumn, LayoutItem, FeideUserApiType, constants } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import {
  CustomWithTranslation,
  TFunction,
  withTranslation,
} from 'react-i18next';
import { GraphQLError } from 'graphql';
import Article from '../../components/Article';
import ArticleHero from './components/ArticleHero';
import ArticleErrorMessage from './components/ArticleErrorMessage';
import { getContentType, isHeroContentType } from '../../util/getContentType';
import { getArticleScripts, Scripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle, {
  structuredArticleDataFragment,
} from '../../util/getStructuredDataFromArticle';
import { htmlTitle } from '../../util/titleHelper';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import { transformArticle } from '../../util/transformArticle';
import Resources from '../Resources/Resources';
import {
  isLearningPathResource,
  getLearningPathUrlFromResource,
} from '../Resources/resourceHelpers';
import { RedirectExternal, Status } from '../../components';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { toBreadcrumbItems } from '../../routeHelpers';
import { getSubjectLongName } from '../../data/subjects';
import config from '../../config';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from '../../constants';
import {
  GQLArticlePage_ResourceFragment,
  GQLArticlePage_ResourceTypeFragment,
  GQLArticlePage_SubjectFragment,
  GQLArticlePage_TopicFragment,
  GQLArticlePage_TopicPathFragment,
} from '../../graphqlTypes';

interface Props extends CustomWithTranslation {
  resource?: GQLArticlePage_ResourceFragment;
  topic?: GQLArticlePage_TopicFragment;
  topicPath: GQLArticlePage_TopicPathFragment[];
  relevance: string;
  subject?: GQLArticlePage_SubjectFragment;
  resourceTypes?: GQLArticlePage_ResourceTypeFragment[];
  errors?: readonly GraphQLError[];
  loading?: boolean;
  user?: FeideUserApiType;
  skipToContentId?: string;
}

const ArticlePage = ({
  resource,
  topic,
  resourceTypes,
  subject,
  topicPath,
  errors,
  i18n,
  t,
  skipToContentId,
}: Props) => {
  const [scripts, setScripts] = useState<Scripts[]>([]);
  const subjectPageUrl = config.ndlaFrontendDomain;
  useEffect(() => {
    if (!resource?.article) return;
    const article = transformArticle(resource.article, i18n.language);
    const scripts = getArticleScripts(article);
    setScripts(scripts);
  }, [i18n.language, resource]);

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === 'function') {
      window.MathJax.typeset();
    }
  });

  if (resource && isLearningPathResource(resource)) {
    const url = getLearningPathUrlFromResource(resource);
    return (
      <Status code={307}>
        <RedirectExternal to={url} />
      </Status>
    );
  }
  if (!resource?.article) {
    const error = errors?.find(e => e.path?.includes('resource'));
    return (
      <div>
        <ArticleErrorMessage
          //@ts-ignore
          status={error?.status}>
          {topic && <Resources topic={topic} resourceTypes={resourceTypes} />}
        </ArticleErrorMessage>
      </div>
    );
  }

  const article = transformArticle(resource.article, i18n.language)!;
  const contentType = resource ? getContentType(resource) : undefined;
  const resourceType =
    contentType && isHeroContentType(contentType) ? contentType : undefined;

  const copyPageUrlLink = topic
    ? `${subjectPageUrl}${topic.path}/${resource.id.replace('urn:', '')}`
    : undefined;
  const printUrl = `${subjectPageUrl}/article-iframe/${i18n.language}/article/${resource.article.id}`;

  const breadcrumbItems = toBreadcrumbItems(
    t('breadcrumb.toFrontpage'),
    [subject, ...topicPath, resource],
    i18n.language,
  );

  return (
    <div>
      <ArticleHero
        subject={subject}
        resourceType={resourceType}
        metaImage={article.metaImage}
        breadcrumbItems={breadcrumbItems}
      />
      <Helmet>
        <title>{`${getDocumentTitle(t, resource, subject)}`}</title>
        {article?.metaDescription && (
          <meta name="description" content={article.metaDescription} />
        )}
        {scripts.map(script => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            async={script.async}
            defer={script.defer}
          />
        ))}
        {copyPageUrlLink && (
          <link
            rel="alternate"
            type="application/json+oembed"
            href={`${config.ndlaFrontendDomain}/oembed?url=${copyPageUrlLink}`}
            title={article.title}
          />
        )}
        {subject?.metadata.customFields?.[
          TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY
        ] === constants.subjectCategories.ARCHIVE_SUBJECTS && (
          <meta name="robots" content="noindex" />
        )}

        <script type="application/ld+json">
          {JSON.stringify(
            getStructuredDataFromArticle(resource.article, breadcrumbItems),
          )}
        </script>
      </Helmet>
      <SocialMediaMetadata
        title={htmlTitle(article.title, [subject?.name])}
        trackableContent={article}
        description={article.metaDescription}
        imageUrl={article.metaImage?.url}
      />
      <OneColumn>
        <Article
          id={skipToContentId}
          article={article}
          resourceType={contentType}
          isResourceArticle
          copyPageUrlLink={copyPageUrlLink}
          printUrl={printUrl}
          subjectId={subject?.id}
          showFavoriteButton={config.feideEnabled}
          {...getArticleProps(resource, topic)}
        />
        {topic && (
          <LayoutItem layout="extend">
            <Resources topic={topic} resourceTypes={resourceTypes} />
          </LayoutItem>
        )}
      </OneColumn>
    </div>
  );
};

ArticlePage.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  if (currentProps.loading) {
    return;
  }
  trackPageView(currentProps);
};

ArticlePage.getDimensions = (props: Props) => {
  const articleProps = getArticleProps(props.resource);
  const { subject, topicPath, relevance, user } = props;
  const article = props.resource?.article;
  const longName = getSubjectLongName(subject?.id, props.i18n.language);

  return getAllDimensions(
    { article, relevance, subject, topicPath, filter: longName, user },
    articleProps.label,
    true,
  );
};

const getDocumentTitle = (
  t: TFunction,
  resource?: GQLArticlePage_ResourceFragment,
  subject?: GQLArticlePage_SubjectFragment,
) =>
  htmlTitle(resource?.article?.title, [
    subject?.name,
    t('htmlTitles.titleTemplate'),
  ]);

ArticlePage.getDocumentTitle = ({ t, resource, subject }: Props) =>
  getDocumentTitle(t, resource, subject);

export const articlePageFragments = {
  resourceType: gql`
    fragment ArticlePage_ResourceType on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
  subject: gql`
    fragment ArticlePage_Subject on Subject {
      name
      metadata {
        customFields
      }
      ...ArticleHero_Subject
    }
    ${ArticleHero.fragments.subject}
  `,
  resource: gql`
    fragment ArticlePage_Resource on Resource {
      id
      name
      contentUri
      article(subjectId: $subjectId) {
        created
        updated
        metaDescription
        metaImage {
          ...ArticleHero_MetaImage
        }
        ...StructuredArticleData
        ...Article_Article
      }
    }
    ${structuredArticleDataFragment}
    ${ArticleHero.fragments.metaImage}
    ${Article.fragments.article}
  `,
  topic: gql`
    fragment ArticlePage_Topic on Topic {
      path
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
  `,
  topicPath: gql`
    fragment ArticlePage_TopicPath on Topic {
      id
      name
    }
  `,
};

export default withTranslation()(withTracker(ArticlePage));
