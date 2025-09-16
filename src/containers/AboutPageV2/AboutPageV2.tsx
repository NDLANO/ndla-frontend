/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import { AboutPageLeaf } from "./AboutPageLeaf";
import { AboutPageNode } from "./AboutPageNode";
import { findBreadcrumb, getBreadcrumb } from "./aboutPageUtils";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import RedirectContext, { RedirectInfo } from "../../components/RedirectContext";
import { GQLAboutPageV2Query, GQLAboutPageV2QueryVariables } from "../../graphqlTypes";
import { useTypedParams } from "../../routeHelpers";
import { GONE } from "../../statusCodes";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

// TODO: Rename query
const aboutPageQuery = gql`
  query aboutPageV2($slug: String!, $transformArgs: TransformedArticleContentInput) {
    article(id: $slug) {
      ...AboutPageLeaf_Article
      ...AboutPageNode_Article
    }
    frontpage {
      ...AboutPageNode_FrontpageMenu
      menu {
        ...AboutPageNode_FrontpageMenu
        menu {
          ...AboutPageNode_FrontpageMenu
          menu {
            ...AboutPageNode_FrontpageMenu
          }
        }
      }
    }
  }
  ${AboutPageLeaf.fragments.article}
  ${AboutPageNode.fragments.article}
  ${AboutPageNode.fragments.frontpageMenu}
`;

export const AboutPage = () => {
  const { t } = useTranslation();
  const { slug } = useTypedParams<{ slug: string }>();
  const { error, loading, data } = useQuery<GQLAboutPageV2Query, GQLAboutPageV2QueryVariables>(aboutPageQuery, {
    skip: !slug,
    variables: { slug },
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

  const crumb = findBreadcrumb(data.frontpage.menu, slug);
  const currentItem = crumb.at(-1);

  if (currentItem?.menu?.length) {
    return <AboutPageNode article={data.article} menuItems={currentItem.menu} crumbs={getBreadcrumb(crumb, t)} />;
  }

  return <AboutPageLeaf article={data.article} crumbs={getBreadcrumb(crumb, t)} />;
};

export const Component = AboutPage;
