/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { OneColumn, LayoutItem, FeideUserApiType, constants } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import {
  CustomWithTranslation,
  TFunction,
  withTranslation,
} from 'react-i18next';
import { GraphQLError } from 'graphql';
import { DynamicComponents } from '@ndla/article-converter';
import Article from '../../components/Article';
import ArticleHero from './components/ArticleHero';
import ArticleErrorMessage from './components/ArticleErrorMessage';
import { getContentType, isHeroContentType } from '../../util/getContentType';
import { getArticleScripts } from '../../util/getArticleScripts';
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
import config from '../../config';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from '../../constants';
import {
  GQLArticlePage_ResourceFragment,
  GQLArticlePage_ResourceTypeFragment,
  GQLArticlePage_SubjectFragment,
  GQLArticlePage_TopicFragment,
  GQLArticlePage_TopicPathFragment,
} from '../../graphqlTypes';
import { useDisableConverter } from '../../components/ArticleConverterContext';
import AddEmbedToFolder from '../../components/MyNdla/AddEmbedToFolder';

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

const converterComponents: DynamicComponents | undefined =
  config.favoriteEmbedEnabled ? { heartButton: AddEmbedToFolder } : undefined;

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
  const subjectPageUrl = config.ndlaFrontendDomain;
  const disableConverter = useDisableConverter();

  const [article, scripts] = useMemo(() => {
    if (!resource?.article) return [];
    return [
      transformArticle(resource?.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${resource.article?.id}`,
        enabled: disableConverter,
        subject: subject?.id,
        components: converterComponents,
      }),
      getArticleScripts(resource.article, i18n.language),
    ];
  }, [subject?.id, resource?.article, i18n.language, disableConverter])!;

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === 'function') {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
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
  if (!resource?.article || !article) {
    const error = errors?.find((e) => e.path?.includes('resource'));
    return (
      <div>
        <ArticleErrorMessage
          //@ts-ignore
          status={error?.status}
        >
          {topic && (
            <Resources
              topic={topic}
              resourceTypes={resourceTypes}
              headingType="h2"
              subHeadingType="h3"
            />
          )}
        </ArticleErrorMessage>
      </div>
    );
  }

  const contentType = resource ? getContentType(resource) : undefined;
  const resourceType =
    contentType && isHeroContentType(contentType) ? contentType : undefined;

  const copyPageUrlLink = topic
    ? `${subjectPageUrl}${topic.path}/${resource.id.replace('urn:', '')}`
    : undefined;
  const printUrl = `${subjectPageUrl}/article-iframe/${i18n.language}/article/${resource.article.id}`;

  const breadcrumbItems = toBreadcrumbItems(t('breadcrumb.toFrontpage'), [
    subject,
    ...topicPath,
    resource,
  ]);

  return (
    <main>
      <ArticleHero
        subject={subject}
        resourceType={resourceType}
        metaImage={article.metaImage}
        breadcrumbItems={breadcrumbItems}
      />
      <Helmet>
        <title>{`${getDocumentTitle(t, resource, subject)}`}</title>
        {scripts?.map((script) => (
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
          <meta name="robots" content="noindex, nofollow" />
        )}
        <meta name="pageid" content={`${article.id}`} />
        <script type="application/ld+json">
          {JSON.stringify(
            getStructuredDataFromArticle(
              resource.article,
              i18n.language,
              breadcrumbItems,
            ),
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
          contentTransformed={disableConverter}
          path={resource.path}
          id={skipToContentId}
          article={article}
          resourceType={contentType}
          isResourceArticle
          printUrl={printUrl}
          subjectId={subject?.id}
          showFavoriteButton={config.feideEnabled}
          {...getArticleProps(resource, topic)}
        />
        {topic && (
          <LayoutItem layout="extend">
            <Resources
              topic={topic}
              resourceTypes={resourceTypes}
              headingType="h2"
              subHeadingType="h3"
            />
          </LayoutItem>
        )}
      </OneColumn>
    </main>
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

  return getAllDimensions(
    { article, relevance, subject, topicPath, filter: subject?.name, user },
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
    subject?.subjectpage?.about?.title || subject?.name,
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
      subjectpage {
        about {
          title
        }
      }
      ...ArticleHero_Subject
    }
    ${ArticleHero.fragments.subject}
  `,
  resource: gql`
    fragment ArticlePage_Resource on Resource {
      id
      name
      path
      contentUri
      article(subjectId: $subjectId, convertEmbeds: $convertEmbeds) {
        created
        updated
        metaDescription
        metaImage {
          ...ArticleHero_MetaImage
        }
        tags
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
