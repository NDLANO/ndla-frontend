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
import { PageTitle } from "../../components/PageTitle";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { GQLRevisionsQuery, GQLRevisionsQueryVariables } from "../../graphqlTypes";
import { toRevision } from "../../routeHelpers";
import { formatDate } from "../../util/formatDate";
import { isAccessDeniedError, isGoneError, isNotFoundError } from "../../util/handleError";
import { AccessDeniedPage } from "../AccessDeniedPage/AccessDeniedPage";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { UnpublishedResourcePage } from "../UnpublishedResourcePage/UnpublishedResourcePage";

const queryDef = gql`
  query revisions($articleId: Int!, $articleIdString: String!) {
    revisionHistory(id: $articleId) {
      revisions {
        id
        revision
        updated
      }
    }
    article(id: $articleIdString) {
      id
      title
      revision
      updated
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

const TextBlock = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    borderRadius: "xsmall",
    paddingBlock: "medium",
    paddingInline: "medium",
    alignItems: "flex-start",
  },
});

export const RevisionsPage = () => {
  const { t, i18n } = useTranslation();
  const { articleId } = useParams();
  const parsedArticleId = Number(articleId);
  const query = useQuery<GQLRevisionsQuery, GQLRevisionsQueryVariables>(queryDef, {
    variables: { articleId: parsedArticleId, articleIdString: articleId ?? "" },
    skip: !parsedArticleId,
  });

  const revisionsWithoutCurrent = useMemo(() => {
    const history = query.data?.revisionHistory?.revisions;
    const article = query.data?.article;
    if (!history || !article) return [];
    const filtered = history.filter((rev) => rev.revision !== article.revision);
    return sortBy(filtered, (rev) => -rev.revision);
  }, [query.data]);

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

  return (
    <StyledMain>
      <PageTitle title={t("htmlTitles.revisionsPage", { name: article.title })} />
      <SocialMediaMetadata type="website" title={`${t("revisionsPage.changelogFor")} ${article.title}`} />
      <meta name="robots" content="noindex" />
      <StyledPageContent>
        <hgroup>
          <Text textStyle="label.large">{t("revisionsPage.changelogFor")}</Text>
          <Heading textStyle="heading.small">{query.data.article?.title}</Heading>
        </hgroup>
      </StyledPageContent>
      <StyledPageContainer>
        <RevisionsContainer>
          <Heading asChild consumeCss textStyle="heading.small">
            <h2>{t("revisionsPage.currentRevision")}</h2>
          </Heading>
          <StyledListItemRoot>
            <TextBlock>
              <ListItemHeading asChild consumeCss css={linkOverlay.raw()}>
                <SafeLink to={toRevision(parsedArticleId, article.revision)}>
                  {t("revision.revisionNo", { revision: article.revision })}
                </SafeLink>
              </ListItemHeading>
              <time dateTime={article.updated}>{formatDate(article.updated, i18n.language)}</time>
            </TextBlock>
            <Text>{t("revision.currentRevision")}</Text>
          </StyledListItemRoot>
        </RevisionsContainer>
        {!!revisionsWithoutCurrent.length && (
          <RevisionsContainer>
            <Heading asChild consumeCss textStyle="heading.small">
              <h2>{t("revisionsPage.previousRevisions")}</h2>
            </Heading>
            <StyledUl>
              {revisionsWithoutCurrent.map((revision) => (
                <StyledListItemRoot key={revision.revision} asChild consumeCss>
                  <li>
                    <TextBlock>
                      <ListItemHeading asChild consumeCss css={linkOverlay.raw()}>
                        <SafeLink to={toRevision(parsedArticleId, revision.revision)}>
                          {t("revision.revisionNo", { revision: revision.revision })}
                        </SafeLink>
                      </ListItemHeading>
                      <time dateTime={revision.updated}>{formatDate(revision.updated, i18n.language)}</time>
                    </TextBlock>
                    <Text>{t("revision.outdatedRevision")}</Text>
                  </li>
                </StyledListItemRoot>
              ))}
            </StyledUl>
          </RevisionsContainer>
        )}
      </StyledPageContainer>
    </StyledMain>
  );
};

export const Component = RevisionsPage;
