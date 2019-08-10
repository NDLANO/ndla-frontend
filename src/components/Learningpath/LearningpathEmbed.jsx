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
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import Article from '../Article';
import { LearningpathStepShape } from '../../shapes';
import { transformArticle } from '../../util/transformArticle';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { TopicShape, ResourceShape } from '../../shapes';

const StyledIframeContainer = styled.div`
  margin-bottom: ${spacing.normal};
  & > iframe {
    padding-top: 1em;
    border: 0 none;
    max-width: 100%;
    width: ${p => p.oembedWidth}px;
    height: ${p => p.oembedHeight}px;
  }
`;

const LearningpathEmbed = ({
  learningpathStep,
  skipToContentId,
  locale,
  topic,
}) => {
  if (
    !learningpathStep ||
    (!learningpathStep.article && !learningpathStep.embedUrl)
  ) {
    return null;
  }
  const { embedUrl, oembed } = learningpathStep;
  if (
    !learningpathStep.resource &&
    embedUrl &&
    embedUrl.embedType === 'oembed' &&
    oembed &&
    oembed.html
  ) {
    return (
      <StyledIframeContainer
        oembedWidth={oembed.width}
        oembedHeight={oembed.height}
        dangerouslySetInnerHTML={{ __html: oembed.html }}
      />
    );
  }
  const learningpathStepResource = learningpathStep.resource;
  const article = transformArticle(learningpathStepResource.article);
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
        {...getArticleProps(learningpathStepResource, topic)}
      />
    </>
  );
};

LearningpathEmbed.propTypes = {
  learningpathStep: LearningpathStepShape,
  topic: TopicShape,
  skipToContentId: PropTypes.string,
  locale: PropTypes.string.isRequired,
};
export default LearningpathEmbed;
