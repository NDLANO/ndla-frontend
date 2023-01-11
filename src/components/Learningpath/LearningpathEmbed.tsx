/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import Article from '../Article';
import { transformArticle } from '../../util/transformArticle';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle, {
  structuredArticleDataFragment,
} from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import LearningpathIframe from './LearningpathIframe';
import { Breadcrumb } from '../../interfaces';
import ErrorPage from '../../containers/ErrorPage';
import {
  GQLLearningpathEmbed_LearningpathStepFragment,
  GQLLearningpathEmbed_TopicFragment,
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
  learningpathStep: GQLLearningpathEmbed_LearningpathStepFragment;
  topic?: GQLLearningpathEmbed_TopicFragment;
  skipToContentId?: string;
  breadcrumbItems: Breadcrumb[];
}
const LearningpathEmbed = ({
  learningpathStep,
  skipToContentId,
  topic,
  breadcrumbItems,
}: Props) => {
  const { i18n } = useTranslation();
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
    return <ErrorPage />;
  }

  const article = transformArticle(
    learningpathStepResource.article,
    i18n.language,
  );
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
              i18n.language,
              breadcrumbItems,
            ),
          )}
        </script>
      </Helmet>
      <Article
        isPlainArticle
        id={skipToContentId}
        article={article}
        {...getArticleProps(learningpathStepResource, topic)}
      />
    </>
  );
};

LearningpathEmbed.fragments = {
  topic: gql`
    fragment LearningpathEmbed_Topic on Topic {
      supplementaryResources(subjectId: $subjectId) {
        id
      }
    }
  `,
  learningpathStep: gql`
    fragment LearningpathEmbed_LearningpathStep on LearningpathStep {
      resource {
        id
        article {
          id
          metaDescription
          created
          updated
          metaDescription
          requiredLibraries {
            name
            url
            mediaType
          }
          ...StructuredArticleData
          ...Article_Article
        }
      }
      embedUrl {
        embedType
        url
      }
      oembed {
        html
        width
        height
      }
    }
    ${structuredArticleDataFragment}
    ${Article.fragments.article}
  `,
};

export default LearningpathEmbed;
