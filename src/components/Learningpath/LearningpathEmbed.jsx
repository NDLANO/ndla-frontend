/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import Article from '../Article';
import { LearningpathStepShape } from '../../shapes';
import { transformArticle } from '../../util/transformArticle';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { TopicShape, ResourceShape } from '../../shapes';

const StyledIframe = styled.iframe`
  padding-top: 1em;
  border: 0 none;
  max-width: 100%;
`;

const LearningpathEmbed = ({
  learningpathStep,
  skipToContentId,
  locale,
  resource,
  topic,
}) => {
  console.log('fjjf', locale, skipToContentId);
  if (
    !learningpathStep ||
    (!learningpathStep.article && !learningpathStep.embedUrl)
  ) {
    return null;
  }
  console.log('dkdk', learningpathStep);
  if (
    !learningpathStep.article &&
    learningpathStep.embedUrl &&
    learningpathStep.embedUrl.embedType === 'oembed'
  ) {
    return <StyledIframe src={learningpathStep.embedUrl.url} />;
  }

  const article = transformArticle(learningpathStep.article);
  const scripts = getArticleScripts(article);
  return (
    <>
      <Helmet>
        {article && article.metaDescription && (
          <meta name="description" content={article.metaDescription} />
        )}
        {scripts.map(script => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            async={script.async}
          />
        ))}

        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(article))}
        </script>
      </Helmet>
      <Article
        id={skipToContentId}
        article={article}
        locale={locale}
        {...getArticleProps(resource, topic)}
      />
    </>
  );
};

LearningpathEmbed.propTypes = {
  learningpathStep: LearningpathStepShape,
  topic: TopicShape,
  skipToContentId: PropTypes.string,
  resource: ResourceShape,
  locale: PropTypes.string.isRequired,
};
export default LearningpathEmbed;
