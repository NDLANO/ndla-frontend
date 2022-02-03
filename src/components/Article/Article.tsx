/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType, ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Remarkable } from 'remarkable';
// @ts-ignore
import { Article as UIArticle, ContentTypeBadge } from '@ndla/ui';
import config from '../../config';
import LicenseBox from '../license/LicenseBox';
import CompetenceGoals from '../CompetenceGoals';
import { GQLArticle, GQLArticleInfoFragment } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import VisualElementWrapper from '../VisualElement/VisualElementWrapper';
import { MastheadHeightPx } from '../../constants';

function renderCompetenceGoals(
  article: GQLArticle,
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
  if (
    !isTopicArticle &&
    (article.competenceGoals?.length || article.coreElements?.length)
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
  article: GQLArticleInfoFragment;
  resourceType?: string;
  isTopicArticle?: boolean;
  children?: React.ReactElement;
  contentType?: string;
  label: string;
  locale: LocaleType;
  isResourceArticle?: boolean;
  copyPageUrlLink?: string;
  printUrl?: string;
  subjectId?: string;
}

const renderNotions = (article: GQLArticleInfoFragment, locale: LocaleType) => {
  const notions =
    article.concepts?.map(concept => {
      const { content: text, copyright, subjectNames, visualElement } = concept;
      const { creators: authors, license } = copyright!;
      return {
        ...concept,
        id: concept.id.toString(),
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
    article.relatedContent?.map(rc => ({
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

const Article = ({
  article,
  resourceType,
  isTopicArticle = false,
  children,
  contentType,
  label,
  locale,
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
        const scrollPosition = absoluteTop - MastheadHeightPx * 2;

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
      notions={renderNotions(article, i18n.language as LocaleType)}
      renderMarkdown={renderMarkdown}
      modifier={isResourceArticle ? resourceType : 'clean'}
      copyPageUrlLink={copyPageUrlLink}
      printUrl={printUrl}
      {...rest}>
      {children}
    </UIArticle>
  );
};

export default Article;
