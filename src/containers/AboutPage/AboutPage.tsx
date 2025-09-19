/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import AboutPageContent, { aboutPageFragments } from "./AboutPageContent";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import { GQLAboutPageQuery, GQLAboutPageQueryVariables } from "../../graphqlTypes";
import { useTypedParams } from "../../routeHelpers";
import { GONE } from "../../statusCodes";
import { isGoneError } from "../../util/handleError";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

const aboutPageQuery = gql`
  query aboutPage($slug: String!, $transformArgs: TransformedArticleContentInput) {
    article(id: $slug) {
      ...AboutPage_Article
    }
    frontpage {
      ...AboutPage_FrontpageMenu
    }
  }
  ${aboutPageFragments.article}
  ${aboutPageFragments.frontpageMenu}
`;

export const AboutPage = () => {
  const { slug } = useTypedParams<{ slug: string }>();
  const { error, loading, data } = useQuery<GQLAboutPageQuery, GQLAboutPageQueryVariables>(aboutPageQuery, {
    skip: !slug,
    variables: {
      slug,
    },
  });

  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);

  if (loading) {
    return <ContentPlaceholder variant="article" />;
  }

  if (isGoneError(error) && redirectContext) {
    redirectContext.status = GONE;
  }

  if (!data?.article || !data.frontpage) {
    return <NotFoundPage />;
  } else if (error) {
    return <DefaultErrorMessagePage />;
  }

  return <AboutPageContent key={data.article.slug} article={data.article} frontpage={data.frontpage} />;
};

export const Component = AboutPage;
