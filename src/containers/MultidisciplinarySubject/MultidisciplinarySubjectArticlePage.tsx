/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import MultidisciplinarySubjectArticle, {
  multidisciplinarySubjectArticleFragments,
} from "./components/MultidisciplinarySubjectArticle";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import {
  GQLMultidisciplinarySubjectArticlePageQuery,
  GQLMultidisciplinarySubjectArticlePageQueryVariables,
} from "../../graphqlTypes";
import { useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import { htmlTitle } from "../../util/titleHelper";

const multidisciplinarySubjectArticlePageQuery = gql`
  query multidisciplinarySubjectArticlePage(
    $topicId: String!
    $subjectId: String!
    $transformArgs: TransformedArticleContentInput
  ) {
    node(id: $topicId, rootId: $subjectId) {
      id
      name
      path
      url
      article {
        introduction
        metaDescription
        tags
        metaImage {
          url
        }
      }
      ...MultidisciplinarySubjectArticle_Node
    }
    resourceTypes {
      ...MultidisciplinarySubjectArticle_ResourceTypeDefinition
    }
  }
  ${multidisciplinarySubjectArticleFragments.resourceType}
  ${multidisciplinarySubjectArticleFragments.node}
`;

interface Props {
  subjectId: string;
  topicId?: string;
}

const MultidisciplinarySubjectArticlePage = ({ subjectId, topicId: maybeTopicId }: Props) => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const { topicId: tId } = useUrnIds();
  const topicId = maybeTopicId ?? tId;

  const { data, loading } = useGraphQuery<
    GQLMultidisciplinarySubjectArticlePageQuery,
    GQLMultidisciplinarySubjectArticlePageQueryVariables
  >(multidisciplinarySubjectArticlePageQuery, {
    variables: {
      topicId: topicId!,
      subjectId: subjectId!,
      transformArgs: {
        subjectId: subjectId!,
        showVisualElement: "true",
        prettyUrl: enablePrettyUrls,
      },
    },
  });

  if (loading) {
    return <ContentPlaceholder variant="article" />;
  }

  if (!data?.node) {
    return <DefaultErrorMessagePage />;
  }

  const { node, resourceTypes } = data;
  const root = node.context?.parents?.[0];

  const socialMediaMetaData = {
    title: htmlTitle(node.name ?? node.article?.title, [root?.name]),
    description: node.article?.metaDescription ?? node.article?.introduction,
    image: node.article?.metaImage,
  };

  return (
    <>
      <Helmet>
        <title>{htmlTitle(socialMediaMetaData.title, [t("htmlTitles.titleTemplate")])}</title>
      </Helmet>
      <SocialMediaMetadata
        title={socialMediaMetaData.title}
        description={socialMediaMetaData.description}
        imageUrl={socialMediaMetaData.image?.url}
        trackableContent={{
          supportedLanguages: node.article?.supportedLanguages,
          tags: node.article?.tags,
        }}
      />
      <MultidisciplinarySubjectArticle
        skipToContentId={SKIP_TO_CONTENT_ID}
        node={node}
        root={root}
        resourceTypes={resourceTypes}
      />
    </>
  );
};

export default MultidisciplinarySubjectArticlePage;
