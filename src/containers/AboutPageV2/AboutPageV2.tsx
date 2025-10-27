/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { AboutPageLeaf } from "./AboutPageLeaf";
import { AboutPageNode } from "./AboutPageNode";
import { findBreadcrumb, getBreadcrumb } from "./aboutPageUtils";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { RedirectContext, RedirectInfo } from "../../components/RedirectContext";
import { GQLAboutPageQuery, GQLAboutPageQueryVariables } from "../../graphqlTypes";
import { GONE } from "../../statusCodes";
import { isGoneError } from "../../util/handleError";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

const aboutPageQuery = gql`
  query aboutPage($slug: String!, $transformArgs: TransformedArticleContentInput) {
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
  const { slug } = useParams();
  const { error, loading, data } = useQuery<GQLAboutPageQuery, GQLAboutPageQueryVariables>(aboutPageQuery, {
    skip: !slug,
    variables: { slug: slug ?? "" },
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

  const crumb = findBreadcrumb(data.frontpage.menu, slug);
  const currentItem = crumb.at(-1);

  if (currentItem?.menu?.length) {
    return <AboutPageNode article={data.article} menuItems={currentItem.menu} crumbs={getBreadcrumb(crumb, t)} />;
  }

  return <AboutPageLeaf article={data.article} crumbs={getBreadcrumb(crumb, t)} />;
};

export const Component = AboutPage;
