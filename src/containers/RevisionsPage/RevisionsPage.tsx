/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Heading, ListItemHeading, ListItemRoot, PageContent, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { sortBy } from "@ndla/util";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageSpinner } from "../../components/PageSpinner";
import { GQLRevisionsQuery, GQLRevisionsQueryVariables } from "../../graphqlTypes";
import {} from "../../routeHelpers";
import { isAccessDeniedError, isGoneError, isNotFoundError } from "../../util/handleError";
import { AccessDeniedPage } from "../AccessDeniedPage/AccessDeniedPage";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { UnpublishedResourcePage } from "../UnpublishedResourcePage/UnpublishedResourcePage";

const queryDef = gql`
  query revisions($articleId: Int!, $articleIdString: String!) {
    revisions(articleId: $articleId)
    article(id: $articleIdString) {
      id
      title
      revision
    }
  }
`;

const StyledMain = styled("main", {
  base: {
    background: "background.strong",
    minHeight: "inherit",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xxlarge",
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    paddingBlockStart: "5xlarge",
    background: "background.default",
    paddingBlockEnd: "xxlarge",
  },
});

const RevisionsContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledUl = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

export const RevisionsPage = () => {
  const { t } = useTranslation();
  const { articleId } = useParams();
  const parsedArticleId = Number(articleId);
  const query = useQuery<GQLRevisionsQuery, GQLRevisionsQueryVariables>(queryDef, {
    variables: { articleId: parsedArticleId, articleIdString: articleId ?? "" },
    skip: !parsedArticleId,
  });

  const revisionsWithoutCurrent = useMemo(() => {
    return sortBy(
      query.data?.revisions.filter((revision) => revision !== query.data?.article?.revision) ?? [],
      (rev) => -rev,
    );
  }, [query.data?.article?.revision, query.data?.revisions]);

  if (query.loading) {
    return <PageSpinner />;
  }

  if (isGoneError(query.error)) {
    return <UnpublishedResourcePage />;
  }

  if (query.error) {
    if (isAccessDeniedError(query.error)) {
      return <AccessDeniedPage />;
    }
    if (isNotFoundError(query.error)) {
      return <NotFoundPage />;
    }
    return <DefaultErrorMessagePage />;
  }
  if (!query.data?.article) {
    return <DefaultErrorMessagePage />;
  }

  const article = query.data.article;

  // TODO: Should this be indexed
  // TODO: Page tite
  // TODO: Social media metadata?

  return (
    <StyledMain>
      <StyledPageContent>
        <hgroup>
          <Text textStyle="label.large">{t("revisionsPage.changelogFor")}</Text>
          <Heading textStyle="heading.small">{query.data.article?.title}</Heading>
        </hgroup>
      </StyledPageContent>
      <StyledPageContainer>
        <RevisionsContainer>
          <Heading asChild consumeCss>
            <h2>{t("revisionsPage.currentRevision")}</h2>
          </Heading>
          <ListItemRoot>
            <ListItemHeading asChild consumeCss css={linkOverlay.raw()}>
              <SafeLink to={`/article/${articleId}?revision=${article.revision}`}>
                {t("revision.revisionNo", { revision: article.revision })}
              </SafeLink>
            </ListItemHeading>
          </ListItemRoot>
        </RevisionsContainer>
        {!!revisionsWithoutCurrent.length && (
          <RevisionsContainer>
            <Heading asChild consumeCss>
              <h2>{t("revisionsPage.previousRevisions")}</h2>
            </Heading>
            <StyledUl>
              {revisionsWithoutCurrent.map((revision) => (
                <ListItemRoot key={revision} asChild consumeCss>
                  <li>
                    <ListItemHeading asChild consumeCss css={linkOverlay.raw()}>
                      <SafeLink to={`/article/${articleId}?revision=${revision}`}>
                        {t("revision.revisionNo", { revision })}
                      </SafeLink>
                    </ListItemHeading>
                  </li>
                </ListItemRoot>
              ))}
            </StyledUl>
          </RevisionsContainer>
        )}
      </StyledPageContainer>
    </StyledMain>
  );
};

export const Component = RevisionsPage;
