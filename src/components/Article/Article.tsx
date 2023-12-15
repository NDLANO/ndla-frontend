/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { gql } from '@apollo/client';
import { extractEmbedMetas } from '@ndla/article-converter';
import { webpageReferenceApa7CopyString } from '@ndla/licenses';
import { ConceptMetaData } from '@ndla/types-embed';
import {
  Article as UIArticle,
  ContentTypeBadge,
  getMastheadHeight,
} from '@ndla/ui';
import FavoriteButton from './FavoritesButton';
import NotionsContent from './NotionsContent';
import config from '../../config';
import { MastheadHeightPx } from '../../constants';
import {
  GQLArticleConceptEmbedsQuery,
  GQLArticle_ArticleFragment,
  GQLResourceEmbedInput,
} from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';
import { TransformedBaseArticle } from '../../util/transformArticle';
import CompetenceGoals from '../CompetenceGoals';
import LicenseBox from '../license/LicenseBox';
import AddResourceToFolderModal from '../MyNdla/AddResourceToFolderModal';

interface Props {
  id?: string;
  article: TransformedBaseArticle<GQLArticle_ArticleFragment>;
  resourceType?: string;
  isTopicArticle?: boolean;
  children?: ReactElement;
  contentType?: string;
  label: string;
  modifier?: string;
  isResourceArticle?: boolean;
  printUrl?: string;
  subjectId?: string;
  isPlainArticle?: boolean;
  isOembed?: boolean;
  showFavoriteButton?: boolean;
  myNdlaResourceType?: string;
  path?: string;
  contentTransformed?: boolean;
}

const articleConceptEmbeds = gql`
  query articleConceptEmbeds($resources: [ResourceEmbedInput!]!) {
    resourceEmbeds(resources: $resources) {
      content
      meta {
        ...NotionsContent_Meta
      }
    }
  }
  ${NotionsContent.fragments.metadata}
`;

const Article = ({
  path,
  article,
  resourceType,
  isTopicArticle = false,
  children,
  contentType,
  label,
  modifier,
  isResourceArticle = false,
  printUrl,
  id,
  subjectId,
  isPlainArticle,
  isOembed = false,
  showFavoriteButton,
  myNdlaResourceType = 'article',
  ...rest
}: Props) => {
  const { t, i18n } = useTranslation();

  const [day, month, year] = article.published
    .split('.')
    .map((s) => parseInt(s));
  const published = new Date(year!, month! - 1, day!).toUTCString();
  const copyText = webpageReferenceApa7CopyString(
    article.title,
    undefined,
    published,
    `${config.ndlaFrontendDomain}/article/${article.id}`,
    article.copyright,
    i18n.language,
    '',
    (id: string) => t(id),
  );

  const conceptInputs: GQLResourceEmbedInput[] | undefined = useMemo(() => {
    return article.conceptIds?.map((id) => ({
      id: id.toString(),
      type: 'concept',
      conceptType: 'notion',
    }));
  }, [article.conceptIds]);

  const { data } = useGraphQuery<GQLArticleConceptEmbedsQuery>(
    articleConceptEmbeds,
    {
      variables: { resources: conceptInputs },
      skip:
        typeof window === 'undefined' || // only fetch on client. ssr: false does not work.
        !conceptInputs?.length ||
        isPlainArticle,
    },
  );

  const conceptNotions = useMemo(() => {
    if (!data?.resourceEmbeds?.content) {
      return [];
    }
    return extractEmbedMetas(data.resourceEmbeds.content);
  }, [data?.resourceEmbeds.content]);

  const notions = useMemo(() => {
    if (
      config.ndlaEnvironment === 'prod' ||
      isPlainArticle ||
      (!conceptNotions.length && !article?.relatedContent?.length)
    ) {
      return null;
    }
    return (
      <NotionsContent
        embeds={conceptNotions as ConceptMetaData[]}
        relatedContent={article.relatedContent}
        metadata={data?.resourceEmbeds.meta}
      />
    );
  }, [
    article.relatedContent,
    conceptNotions,
    data?.resourceEmbeds.meta,
    isPlainArticle,
  ]);

  const location = useLocation();

  // Scroll to element with ID passed in as a query-parameter.
  // We use query-params instead of the regular fragments since
  // the article doesn't exist on initial page load (At least without SSR).
  useEffect(() => {
    if (location.hash && article.content) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        const elementTop = element?.getBoundingClientRect().top ?? 0;
        const bodyTop = document.body.getBoundingClientRect().top ?? 0;
        const absoluteTop = elementTop - bodyTop;
        const scrollPosition =
          absoluteTop - (getMastheadHeight() || MastheadHeightPx) - 20;

        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });
      }, 400);
    }
  }, [article.content, location]);

  if (!article) {
    return children || null;
  }

  const icon = contentType ? (
    <ContentTypeBadge type={contentType} background size="large" />
  ) : null;

  const art = {
    ...article,
    introduction: article.introduction!,
    copyright: {
      ...article.copyright,
      license: article.copyright.license!,
      creators: article.copyright.creators ?? [],
      rightsholders: article.copyright.rightsholders ?? [],
      processors: article.copyright.processors ?? [],
      processed: article.copyright.processed ?? false,
    },
    footNotes: article.metaData?.footnotes ?? [],
  };

  const messages = {
    label,
  };

  return (
    <>
      <UIArticle
        id={id ?? article.id.toString()}
        article={art}
        icon={icon}
        licenseBox={
          <LicenseBox
            article={article}
            copyText={copyText}
            printUrl={printUrl}
          />
        }
        messages={messages}
        competenceGoals={
          !isTopicArticle &&
          article.grepCodes?.filter((gc) => gc.toUpperCase().startsWith('K'))
            .length ? (
            <CompetenceGoals
              codes={article.grepCodes}
              subjectId={subjectId}
              supportedLanguages={article.supportedLanguages}
              isOembed={isOembed}
            />
          ) : undefined
        }
        lang={art.language === 'nb' ? 'no' : art.language}
        notions={notions}
        modifier={isResourceArticle ? resourceType : modifier ?? 'clean'}
        heartButton={
          path &&
          config.feideEnabled &&
          showFavoriteButton && (
            <AddResourceToFolderModal
              resource={{
                id: article.id.toString(),
                path,
                resourceType: myNdlaResourceType,
              }}
            >
              <FavoriteButton path={path} />
            </AddResourceToFolderModal>
          )
        }
        {...rest}
      >
        {children}
      </UIArticle>
    </>
  );
};

Article.fragments = {
  article: gql`
    fragment Article_Article on Article {
      id
      content
      created
      updated
      supportedLanguages
      grepCodes
      oldNdlaUrl
      introduction
      conceptIds
      metaData {
        copyText
        footnotes {
          ref
          title
          year
          authors
          edition
          publisher
          url
        }
      }
      relatedContent {
        title
        url
      }
      revisionDate
      language
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
};
export default Article;
