/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {ComponentType, ReactNode, useMemo} from 'react';
import { Remarkable } from 'remarkable';
// @ts-ignore
import { Article as UIArticle, ContentTypeBadge } from '@ndla/ui';
import LicenseBox from '../license/LicenseBox';
import CompetenceGoals from './CompetenceGoals';
import {GQLArticle, GQLSubject} from "../../graphqlTypes";
import {LocaleType} from "../../interfaces";

function renderCompetenceGoals(article: GQLArticle, locale: LocaleType, isTopicArticle: boolean, subject: GQLSubject): ((inp: {
  Dialog: ComponentType;
  dialogProps: { isOpen: boolean; onClose: () => void }
}) => ReactNode) | null {
  // Don't show competence goals for topics or articles without grepCodes
  if (
    !isTopicArticle &&
    (article.competenceGoals?.length || article.coreElements?.length)
  ) {
    return ({ Dialog, dialogProps }:{Dialog: ComponentType, dialogProps: {isOpen: boolean, onClose: () => void}}) => (
      <CompetenceGoals
        article={article}
        language={locale}
        subject={subject}
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

  // const art = transformArticle(article, locale);

  const art = {
    ...article,
    introduction: article.introduction!,
    copyright: {
      ...article.copyright,
      license: article.copyright.license!,
      creators: article.copyright.creators ?? [],
      rightsholders: article.copyright.rightsholders ?? [],
      processors: article.copyright.processors ?? []
    },
    footNotes: article.metaData?.footnotes ?? []
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
      competenceGoals={renderCompetenceGoals(
        article,
        locale,
        isTopicArticle,
        subject,
      )}
      competenceGoalTypes={competenceGoalTypes}
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
