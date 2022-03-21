/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import {
  ComponentType,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Remarkable } from 'remarkable';
import {
  Article as UIArticle,
  ContentTypeBadge,
  getMastheadHeight,
} from '@ndla/ui';
import config from '../../config';
import LicenseBox from '../license/LicenseBox';
import CompetenceGoals from '../CompetenceGoals';
import {
  GQLArticleConceptsQuery,
  GQLArticleConceptsQueryVariables,
  GQLArticle_ArticleFragment,
  GQLArticle_ConceptFragment,
} from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import VisualElementWrapper from '../VisualElement/VisualElementWrapper';
import { MastheadHeightPx } from '../../constants';
import { useGraphQuery } from '../../util/runQueries';

function renderCompetenceGoals(
  article: GQLArticle_ArticleFragment,
  locale: LocaleType,
  isTopicArticle: boolean,
  subjectId?: string,
):
  | ((inp: {
      Dialog: ComponentType;
      dialogProps: { isOpen: boolean; onClose: () => void };
    }) => ReactNode)
  | null {
  // Don't show competence goals for topics or articles without grepCodes
  if (!isTopicArticle && article.competenceGoals?.length) {
    return ({
      Dialog,
      dialogProps,
    }: {
      Dialog: ComponentType;
      dialogProps: { isOpen: boolean; onClose: () => void };
    }) => (
      <CompetenceGoals
        codes={article.grepCodes}
        nodeId={article.oldNdlaUrl?.split('/').pop()}
        subjectId={subjectId}
        language={
          article.supportedLanguages?.find(l => l === locale) ||
          article.supportedLanguages?.[0] ||
          locale
        }
        wrapperComponent={Dialog}
        wrapperComponentProps={dialogProps}
      />
    );
  }
  return null;
}

interface Props {
  id?: string;
  article: GQLArticle_ArticleFragment;
  resourceType?: string;
  isTopicArticle?: boolean;
  children?: ReactElement;
  contentType?: string;
  label: string;
  locale: LocaleType;
  modifier?: string;
  isResourceArticle?: boolean;
  copyPageUrlLink?: string;
  printUrl?: string;
  subjectId?: string;
}

const renderNotions = (
  concepts: GQLArticle_ConceptFragment[],
  relatedContent: GQLArticle_ArticleFragment['relatedContent'],
  locale: LocaleType,
) => {
  const notions =
    concepts?.map(concept => {
      const { content: text, copyright, subjectNames, visualElement } = concept;
      const { creators: authors, license } = copyright!;
      return {
        ...concept,
        id: concept.id,
        title: concept.title,
        text,
        locale,
        labels: subjectNames,
        authors,
        license: license?.license,
        media: visualElement && (
          <VisualElementWrapper visualElement={visualElement} locale={locale} />
        ),
      };
    }) ?? [];
  const related =
    relatedContent?.map(rc => ({
      ...rc,
      label: rc.title,
    })) ?? [];
  if (
    config.ndlaEnvironment !== 'prod' &&
    (notions.length > 0 || related.length > 0)
  ) {
    return {
      list: notions,
      related,
    };
  }
  return undefined;
};

const articleConceptFragment = gql`
  fragment Article_Concept on Concept {
    copyright {
      license {
        license
      }
      creators {
        name
        type
      }
    }
    subjectNames
    id
    title
    content
    visualElement {
      ...VisualElementWrapper_VisualElement
    }
  }
  ${VisualElementWrapper.fragments.visualElement}
`;

const articleConceptQuery = gql`
  query articleConcepts($conceptIds: [Int!]!) {
    conceptSearch(ids: $conceptIds) {
      concepts {
        ...Article_Concept
      }
    }
  }
  ${articleConceptFragment}
`;

const Article = ({
  article,
  resourceType,
  isTopicArticle = false,
  children,
  contentType,
  label,
  locale,
  modifier,
  isResourceArticle = false,
  copyPageUrlLink,
  printUrl,
  id,
  subjectId,
  ...rest
}: Props) => {
  const { i18n } = useTranslation();
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);

  const { data: concepts } = useGraphQuery<
    GQLArticleConceptsQuery,
    GQLArticleConceptsQueryVariables
  >(articleConceptQuery, {
    variables: {
      conceptIds: article.conceptIds!,
    },
    skip:
      typeof window === 'undefined' || // only fetch on client. ssr: false does not work.
      !article.conceptIds ||
      article.conceptIds.length === 0,
  });
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

  const renderMarkdown = (text: string) => {
    return markdown.render(text);
  };

  const icon = contentType ? (
    <ContentTypeBadge type={contentType} background size="large" />
  ) : null;

  const competenceGoalTypes = Array.from(
    new Set(article.competenceGoals?.map(goal => goal.type) ?? []),
  );

  const art = {
    ...article,
    introduction: article.introduction!,
    copyright: {
      ...article.copyright,
      license: article.copyright.license!,
      creators: article.copyright.creators ?? [],
      rightsholders: article.copyright.rightsholders ?? [],
      processors: article.copyright.processors ?? [],
    },
    footNotes: article.metaData?.footnotes ?? [],
  };

  return (
    <UIArticle
      id={id ?? article.id.toString()}
      article={art}
      icon={icon}
      locale={locale}
      licenseBox={<LicenseBox article={article} locale={locale} />}
      messages={{
        label,
      }}
      competenceGoals={renderCompetenceGoals(
        article,
        locale,
        isTopicArticle,
        subjectId,
      )}
      competenceGoalTypes={competenceGoalTypes}
      notions={renderNotions(
        concepts?.conceptSearch?.concepts ?? [],
        article.relatedContent,
        i18n.language as LocaleType,
      )}
      renderMarkdown={renderMarkdown}
      modifier={isResourceArticle ? resourceType : modifier ?? 'clean'}
      copyPageUrlLink={copyPageUrlLink}
      printUrl={printUrl}
      {...rest}>
      {children}
    </UIArticle>
  );
};

Article.fragments = {
  article: gql`
    fragment Article_Article on Article {
      id
      content
      supportedLanguages
      grepCodes
      oldNdlaUrl
      introduction
      conceptIds
      metaData {
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
      competenceGoals {
        type
      }
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
};
export default Article;
