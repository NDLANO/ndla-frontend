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
import { ArticleShape } from '../../shapes';
import config from '../../config';
import CompetenceGoals from './CompetenceGoals';

function renderCompetenceGoals(article, isTopicArticle) {
  // Don't show competence goals for topics or articles without nodeid
  if (isTopicArticle || !article.oldNdlaUrl) {
    // Return null to make sure UIArticle component does not render dialog buttons
    return null;
  }

  // eslint-disable-next-line react/prop-types
  return ({ Dialog, dialogProps }) => (
    <CompetenceGoals
      article={article}
      wrapperComponent={Dialog}
      wrapperComponentProps={dialogProps}
    />
  );
}

const Article = ({
  article,
  isTopicArticle,
  children,
  contentType,
  label,
  locale,
  t,
  ...rest
}) => {
  const markdown = useMemo(() => {
    const md = new Remarkable();
    md.inline.ruler.enable(['sub', 'sup']);
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

  return (
    <UIArticle
      article={article}
      icon={icon}
      locale={locale}
      licenseBox={<LicenseBox article={article} locale={locale} />}
      messages={{
        label,
      }}
      competenceGoals={renderCompetenceGoals(article, isTopicArticle)}
      renderMarkdown={renderMarkdown}
      {...rest}>
      {children}
      {!config.isNdlaProdEnvironment && article.oldNdlaUrl && (
        <a
          className="article-old-ndla-link"
          rel="noopener noreferrer"
          target="_blank"
          href={article.oldNdlaUrl}>
          Gå til orginal artikkel
        </a>
      )}
    </UIArticle>
  );
};

Article.propTypes = {
  article: ArticleShape,
  children: PropTypes.node,
  contentType: PropTypes.string,
  isTopicArticle: PropTypes.bool,
  label: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

Article.defaultProps = {
  isTopicArticle: false,
};

export default injectT(Article);
