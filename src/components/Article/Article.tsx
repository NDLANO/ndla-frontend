/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Remarkable } from 'remarkable';
// @ts-ignore
import { Article as UIArticle, ContentTypeBadge } from '@ndla/ui';
import config from '../../config';
import LicenseBox from '../license/LicenseBox';
import CompetenceGoals from './CompetenceGoals';
import { GQLArticle, GQLConcept, GQLSubject } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import VisualElementWrapper from '../VisualElement/VisualElementWrapper';

function renderCompetenceGoals(
  article: GQLArticle,
  locale: LocaleType,
  isTopicArticle: boolean,
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
        article={article}
        language={locale}
        wrapperComponent={Dialog}
        wrapperComponentProps={dialogProps}
      />
    );
  }
  return null;
}

interface Props {
  article: GQLArticle;
  resourceType: string;
  isTopicArticle: boolean;
  children: React.ReactNode;
  contentType: string;
  label: string;
  subject: GQLSubject;
  locale: LocaleType;
  isResourceArticle: boolean;
  copyPageUrlLink: string;
  printUrl: string;
}

const renderNotions = (article: GQLArticle, locale: LocaleType) => {
  const notions =
    article.concepts?.map((concept: GQLConcept) => {
      const { content: text, copyright, subjectNames, visualElement } = concept;
      const { creators: authors, license } = copyright!;
      return {
        ...concept,
        id: concept.id?.toString()!,
        title: concept.title!,
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
      list: notions!,
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
  subject,
  locale,
  isResourceArticle = false,
  copyPageUrlLink,
  printUrl,
  ...rest
}: Props) => {
  const { i18n } = useTranslation();
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);

  if (!article) {
    return children || null;
  }

  const renderMarkdown = (text: string) => {
    return markdown.render(text);
  };

  const icon = contentType ? (
    <ContentTypeBadge type={contentType} background size="large" />
  ) : null;

  const competenceGoalTypes = [
    // @ts-ignore
    ...new Set(article.competenceGoals?.map(goal => goal.type)),
  ];

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
      id={article.id.toString()}
      article={art}
      icon={icon}
      locale={locale}
      licenseBox={<LicenseBox article={article} locale={locale} />}
      messages={{
        label,
      }}
      competenceGoals={renderCompetenceGoals(article, locale, isTopicArticle)}
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
