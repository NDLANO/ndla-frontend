/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Spinner } from "@ndla/icons";
import SharedArticleContainer, { sharedArticleContainerFragments } from "./SharedArticleContainer";
import {
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
  GQLSharedResourceArticlePageQuery,
  GQLSharedResourceArticlePageQueryVariables,
} from "../../../graphqlTypes";
import { useGraphQuery } from "../../../util/runQueries";
import ErrorPage from "../../ErrorPage";
import NotFoundPage from "../../NotFoundPage/NotFoundPage";

const sharedResourceArticlePageQuery = gql`
  query sharedResourceArticlePage(
    $articleId: String!
    $subjectId: String
    $transformArgs: TransformedArticleContentInput
  ) {
    article(id: $articleId) {
      ...SharedResourceArticleContainer_Article
    }
  }
  ${sharedArticleContainerFragments.article}
`;

interface Props {
  resource: GQLFolderResource;
  meta?: GQLFolderResourceMetaSearchQuery["folderResourceMetaSearch"][0];
  title: string;
}

const SharedArticle = ({ resource, meta, title }: Props) => {
  const { loading, data, error } = useGraphQuery<
    GQLSharedResourceArticlePageQuery,
    GQLSharedResourceArticlePageQueryVariables
  >(sharedResourceArticlePageQuery, {
    variables: {
      articleId: `${resource.resourceId}`,
      transformArgs: {
        showVisualElement: "true",
        path: resource.path,
        isOembed: "false",
      },
    },
  });

  const article = data?.article;

  if (loading) {
    return <Spinner />;
  }
  if (!article || error?.graphQLErrors[0]?.extensions?.status === 404) {
    return <NotFoundPage />;
  } else if (!article || error) {
    return <ErrorPage />;
  }

  return (
    <main>
      <SharedArticleContainer article={article} meta={meta} title={title} />
    </main>
  );
};

export default SharedArticle;
