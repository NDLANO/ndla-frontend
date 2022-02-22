/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import Article from '../Article';
import { transformArticle } from '../../util/transformArticle';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import LearningpathIframe from './LearningpathIframe';
import { Breadcrumb, LocaleType } from '../../interfaces';
import ErrorPage from '../../containers/ErrorPage';
import {
  GQLLearningpathInfoFragment,
  GQLResourcePageQuery,
} from '../../graphqlTypes';

interface StyledIframeContainerProps {
  oembedWidth: number;
  oembedHeight: number;
}
const StyledIframeContainer = styled.div<StyledIframeContainerProps>`
  margin-bottom: ${spacing.normal};
  & > iframe {
    padding-top: 1em;
    border: 0 none;
    max-width: 100%;
    width: ${p => p.oembedWidth}px;
    height: ${p => p.oembedHeight}px;
  }
`;

interface Props {
  learningpathStep: GQLLearningpathInfoFragment['learningsteps'][0];
  topic?: Required<GQLResourcePageQuery>['topic'];
  skipToContentId?: string;
  locale: LocaleType;
  breadcrumbItems: Breadcrumb[];
}
const LearningpathEmbed = ({
  learningpathStep,
  skipToContentId,
  locale,
  topic,
  breadcrumbItems,
}: Props) => {
  if (
    !learningpathStep ||
    (!learningpathStep.resource &&
      (!learningpathStep.embedUrl || !learningpathStep.oembed))
  ) {
    return null;
  }
  const { embedUrl, oembed } = learningpathStep;
  if (
    !learningpathStep.resource &&
    embedUrl &&
    (embedUrl.embedType === 'oembed' || embedUrl.embedType === 'iframe') &&
    oembed &&
    oembed.html
  ) {
    return (
      <StyledIframeContainer
        oembedWidth={oembed.width}
        oembedHeight={oembed.height}>
        <LearningpathIframe html={oembed.html} url={embedUrl.url} />
      </StyledIframeContainer>
    );
  }

  const learningpathStepResource = learningpathStep.resource;

  if (!learningpathStepResource?.article) {
    return <ErrorPage locale={locale} />;
  }

  const article = transformArticle(learningpathStepResource.article, locale);
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
            defer={script.defer}
          />
        ))}

        <script type="application/ld+json">
          {JSON.stringify(
            getStructuredDataFromArticle(
              learningpathStepResource.article,
              breadcrumbItems,
            ),
          )}
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

export default LearningpathEmbed;
