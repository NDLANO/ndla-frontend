/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import AboutPageContent, { aboutPageFragments } from "./AboutPageContent";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import { GQLAboutPageQuery, GQLAboutPageQueryVariables } from "../../graphqlTypes";
import { useTypedParams } from "../../routeHelpers";
import { GONE } from "../../statusCodes";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

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

export const Component = () => {
  return <PrivateRoute element={<AboutPage />} />;
};

const AboutPage = () => {
  const { slug } = useTypedParams<{ slug: string }>();
  const { error, loading, data } = useQuery<GQLAboutPageQuery, GQLAboutPageQueryVariables>(aboutPageQuery, {
    skip: !slug,
    variables: {
      slug,
      transformArgs: { prettyUrl: true },
    },
  });

  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);

  if (loading) {
    return <ContentPlaceholder variant="article" />;
  }

  if (error?.graphQLErrors.some((err) => err.extensions?.status === GONE) && redirectContext) {
    redirectContext.status = GONE;
  }

  if (!data?.article || !data.frontpage) {
    return <NotFoundPage />;
  } else if (error) {
    return <DefaultErrorMessagePage />;
  }

  return <AboutPageContent key={data.article.slug} article={data.article} frontpage={data.frontpage} />;
};
