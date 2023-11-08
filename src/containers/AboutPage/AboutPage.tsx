/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import { ContentPlaceholder } from '@ndla/ui';
import { useContext } from 'react';
import { useGraphQuery } from '../../util/runQueries';
import { useTypedParams } from '../../routeHelpers';
import RedirectContext, {
  RedirectInfo,
} from '../../components/RedirectContext';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import {
  GQLAboutPageQuery,
  GQLAboutPageQueryVariables,
} from '../../graphqlTypes';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import AboutPageContent, { aboutPageFragments } from './AboutPageContent';
import { GONE } from '../../statusCodes';

const aboutPageQuery = gql`
  query aboutPage($slug: String!) {
    article(id: $slug, convertEmbeds: true) {
      ...AboutPage_Article
    }
    frontpage {
      ...AboutPage_FrontpageMenu
    }
  }
  ${aboutPageFragments.article}
  ${aboutPageFragments.frontpageMenu}
`;

const AboutPage = () => {
  const { slug } = useTypedParams<{ slug: string }>();
  const { error, loading, data } = useGraphQuery<
    GQLAboutPageQuery,
    GQLAboutPageQueryVariables
  >(aboutPageQuery, {
    skip: !slug,
    variables: {
      slug,
    },
  });

  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (
    error?.graphQLErrors.some((err) => err.extensions.status === GONE) &&
    redirectContext
  ) {
    redirectContext.status = GONE;
  }

  if (!data?.article || !data.frontpage) {
    return <NotFoundPage />;
  } else if (error) {
    return <DefaultErrorMessage />;
  }

  return <AboutPageContent article={data.article} frontpage={data.frontpage} />;
};

export default AboutPage;
