/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import { Article as UIArticle, ContentTypeBadge } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import LicenseBox from '../license/LicenseBox';
import { ArticleShape } from '../../shapes';
import config from '../../config';
import CompetenceGoals from './CompetenceGoals';
import { competenceGoalsQuery } from '../../queries';
import handleError from '../../util/handleError';

const Article = ({
  article,
  children,
  contentType,
  label,
  locale,
  t,
  ...rest
}) => {
  if (!article) {
    return children || null;
  }

  const nodeId = article.oldNdlaUrl
    ? article.oldNdlaUrl.split('/').pop()
    : null;

  const icon = contentType ? (
    <ContentTypeBadge type={contentType} background size="large" />
  ) : null;

  const articleComponent = (
    <UIArticle
      article={article}
      icon={icon}
      licenseBox={<LicenseBox article={article} locale={locale} />}
      messages={{
        label,
      }}
      {...rest}>
      {children}
      {!config.isNdlaProdEnvironment && (
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

  /**
   * This is super hackish and should be refactored at some point. The
   * problem is that we want to only load the competenceGoals client side.
   * But since the competence goals are rendered in a modal the query happens
   * only after the user presses the modal trigger. Which results in undesirable lag
   * before the goals are shown in the modal
   *
   */
  if (process.env.BUILD_TARGET === 'server') {
    return articleComponent;
  }
  return (
    <Query asyncMode query={competenceGoalsQuery} variables={{ nodeId }}>
      {({ error, data, loading }) => {
        if (error) {
          handleError(error);
        }
        return React.cloneElement(articleComponent, {
          competenceGoals:
            loading || error ? null : <CompetenceGoals data={data} />,
        });
      }}
    </Query>
  );
};

Article.propTypes = {
  article: ArticleShape,
  children: PropTypes.node,
  contentType: PropTypes.string,
  label: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(Article);
