/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';

import { Article as UIArticle, ContentTypeBadge } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import LicenseBox from '../license/LicenseBox';
import { ArticleShape, SubjectShape } from '../../shapes';
import CompetenceGoals from './CompetenceGoals';

function renderCompetenceGoals(article, locale, isTopicArticle, subject) {
  // Don't show competence goals for topics or articles without grepCodes
  if (
    !isTopicArticle &&
    (article.competenceGoals?.length || article.coreElements?.length)
  ) {
    // eslint-disable-next-line react/prop-types
    return ({ Dialog, dialogProps }) => (
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

const Article = ({
  article,
  resourceType,
  isTopicArticle,
  children,
  contentType,
  label,
  subject,
  locale,
  t,
  isResourceArticle,
  copyPageUrlLink,
  printUrl,
  ...rest
}) => {
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);

  if (!article) {
    return children || null;
  }

  const renderMarkdown = text => {
    return markdown.render(text);
  };

  const icon = contentType ? (
    <ContentTypeBadge type={contentType} background size="large" />
  ) : null;

  const competenceGoalTypes = [
    ...new Set(article.competenceGoals?.map(goal => goal.type)),
  ];

  return (
    <UIArticle
      article={article}
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

Article.propTypes = {
  article: ArticleShape,
  resourceType: PropTypes.string,
  children: PropTypes.node,
  contentType: PropTypes.string,
  isTopicArticle: PropTypes.bool,
  label: PropTypes.string.isRequired,
  subject: SubjectShape,
  locale: PropTypes.string.isRequired,
  isResourceArticle: PropTypes.bool,
  copyPageUrlLink: PropTypes.string,
  printUrl: PropTypes.string,
};

Article.defaultProps = {
  isTopicArticle: false,
  isResourceArticle: false,
};

export default injectT(Article);
