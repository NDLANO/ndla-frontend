/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ComponentType,
  ReactNode,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { Remarkable } from 'remarkable';
import { gql } from '@apollo/client';
import {
  Article as UIArticle,
  ContentTypeBadge,
  getMastheadHeight,
} from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import config from '../../config';
import LicenseBox from '../license/LicenseBox';
import CompetenceGoals from '../CompetenceGoals';
import {
  GQLArticleConceptsQuery,
  GQLArticleConceptsQueryVariables,
  GQLArticle_ArticleFragment,
  GQLArticle_ConceptFragment,
} from '../../graphqlTypes';
import { MastheadHeightPx } from '../../constants';
import { useGraphQuery } from '../../util/runQueries';
import AddResourceToFolderModal from '../MyNdla/AddResourceToFolderModal';

function renderCompetenceGoals(
  article: GQLArticle_ArticleFragment,
  isTopicArticle: boolean,
  subjectId?: string,
):
  | ((inp: {
      Dialog: ComponentType;
      dialogProps: { isOpen: boolean; onClose: () => void };
    }) => ReactNode)
  | null {
  // Don't show competence goals for topics or articles without grepCodes
  if (
    !isTopicArticle &&
    (article.competenceGoals?.length ||
      article.grepCodes?.filter(gc => gc.toUpperCase().startsWith('K'))?.length)
  ) {
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
        supportedLanguages={article.supportedLanguages}
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
  modifier?: string;
  isResourceArticle?: boolean;
  copyPageUrlLink?: string;
  printUrl?: string;
  subjectId?: string;
  isPlainArticle?: boolean;
}

const renderNotions = (
  concepts: GQLArticle_ConceptFragment[],
  relatedContent: GQLArticle_ArticleFragment['relatedContent'],
) => {
  const notions =
    concepts?.map(concept => {
      return {
        ...concept,
        labels: concept.subjectNames ?? [],
        text: concept.content ?? '',
        image: concept.image && {
          src: concept.image.src,
          alt: concept.image.altText,
        },
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
    image {
      src
      altText
    }
    visualElement {
      resource
      title
      url
      copyright {
        license {
          license
        }
        creators {
          name
          type
        }
        processors {
          name
          type
        }
        rightsholders {
          name
          type
        }
        origin
      }
      image {
        src
        alt
      }
    }
  }
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
  modifier,
  isResourceArticle = false,
  copyPageUrlLink,
  printUrl,
  id,
  subjectId,
  isPlainArticle,
  ...rest
}: Props) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
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
      article.conceptIds.length === 0 ||
      isPlainArticle,
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

  const messages = {
    label,
  };

  return (
    <>
      <UIArticle
        id={id ?? article.id.toString()}
        article={art}
        icon={icon}
        locale={i18n.language}
        licenseBox={<LicenseBox article={article} />}
        messages={messages}
        competenceGoals={renderCompetenceGoals(
          article,
          isTopicArticle,
          subjectId,
        )}
        competenceGoalTypes={competenceGoalTypes}
        notions={
          isPlainArticle
            ? undefined
            : renderNotions(
                concepts?.conceptSearch?.concepts ?? [],
                article.relatedContent,
              )
        }
        renderMarkdown={renderMarkdown}
        modifier={isResourceArticle ? resourceType : modifier ?? 'clean'}
        copyPageUrlLink={copyPageUrlLink}
        printUrl={printUrl}
        onToggleAddToFavorites={() => setIsOpen(true)}
        {...rest}>
        {children}
      </UIArticle>
      <AddResourceToFolderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        resource={{
          id: article.id,
          path: location.pathname,
          resourceType: 'article',
        }}
      />
    </>
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
      metaImage {
        url
        alt
      }
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
      revisionDate
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
};
export default Article;
