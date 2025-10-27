/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Portal } from "@ark-ui/react";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  ListItemHeading,
  ListItemRoot,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadge, constants } from "@ndla/ui";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { RELEVANCE_SUPPLEMENTARY } from "../../constants";
import { GQLSearchResult_SearchResultFragment } from "../../graphqlTypes";
import { LtiEmbed } from "../../lti/LtiEmbed";
import { useLtiContext } from "../../LtiContext";

interface Props {
  searchResult: GQLSearchResult_SearchResultFragment;
}

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "medium",
  },
});

const StyledButton = styled(Button, {
  base: {
    marginInlineStart: "3xsmall",
    position: "relative",
  },
});

const resultUrl = (result: GQLSearchResult_SearchResultFragment, isLti: boolean, language: string) => {
  if (result.__typename === "NodeSearchResult") {
    // search returns full URL for nodes
    return "/f/".concat(result.url.split("/f/").pop() ?? "");
  }
  if (isLti) {
    const commonPath = `/article-iframe/${language ? `${language}/` : ""}`;
    const publicId = result.contexts[0]?.publicId;
    if (publicId) {
      return `${commonPath}${publicId}/${result.id}`;
    }
    return `${commonPath}article/${result.id}`;
  } else if (result.contexts.length) {
    return result.context?.url ?? result.contexts[0]?.url;
  } else {
    const isLearningpath = result.url.includes("learningpath-api");
    const id = result.url.split("/").pop();
    return isLearningpath ? `/learningpaths/${id}` : `/article/${id}`;
  }
};

export const SearchResult = ({ searchResult }: Props) => {
  const { t, i18n } = useTranslation();
  const ltiContext = useLtiContext();
  const context = searchResult.context ?? searchResult.contexts?.[0];

  const contentType = useMemo(() => {
    if (searchResult.__typename === "NodeSearchResult") {
      // TODO: Should SUBJECT be a part of `contentTypeMapping`?
      return constants.contentTypes.SUBJECT;
    }
    if (context?.resourceTypes?.length) {
      return constants.contentTypeMapping?.[context.resourceTypes[0]?.id ?? "default"];
    } else if (context?.url.startsWith("/e")) {
      return constants.contentTypeMapping[constants.contentTypes.TOPIC] ?? "default";
    }
    return undefined;
  }, [context?.resourceTypes, context?.url, searchResult.__typename]);

  return (
    <StyledListItemRoot asChild consumeCss context="list" colorTheme="neutral">
      <li>
        <ListItemHeading asChild consumeCss fontWeight="bold">
          <SafeLink to={resultUrl(searchResult, ltiContext, i18n.language) ?? ""} unstyled css={linkOverlay.raw()}>
            {searchResult.__typename === "ArticleSearchResult" || searchResult.__typename === "LearningpathSearchResult"
              ? parse(searchResult.htmlTitle)
              : searchResult.title}
          </SafeLink>
        </ListItemHeading>
        {!!searchResult.metaDescription && <Text textStyle="body.large">{searchResult.metaDescription}</Text>}
        {!!context && (
          <Text color="text.subtle" textStyle="label.small">
            <span aria-label={`${t("breadcrumb.breadcrumb")}: ${context.breadcrumbs.join(",")}`}>
              {context.breadcrumbs.join(" > ")}
            </span>
            {searchResult.contexts.length > 1 && (
              <DialogRoot>
                <DialogTrigger asChild>
                  <StyledButton variant="link">
                    {t("searchPage.context.dialogTrigger", {
                      count: searchResult.contexts.length - 1,
                    })}
                  </StyledButton>
                </DialogTrigger>
                <Portal>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("searchPage.context.dialogHeading")}</DialogTitle>
                      <DialogCloseButton />
                    </DialogHeader>
                    <DialogBody>
                      <ul>
                        {searchResult.contexts.map((c) => (
                          <li key={c.url}>
                            <SafeLink to={c.url || ""}>{searchResult.title}</SafeLink>
                            <Text
                              textStyle="label.small"
                              aria-label={`${t("breadcrumb.breadcrumb")}: ${c.breadcrumbs.join(", ")}. ${c.relevanceId === RELEVANCE_SUPPLEMENTARY ? t("resource.tooltipAdditionalTopic") : t("resource.tooltipCoreTopic")}`}
                            >
                              {c.breadcrumbs.join(" › ")}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </DialogBody>
                  </DialogContent>
                </Portal>
              </DialogRoot>
            )}
          </Text>
        )}
        {!!contentType && <ContentTypeBadge contentType={contentType} />}
        {!!ltiContext && (
          <LtiEmbed
            item={{
              id: searchResult.id,
              title: searchResult.title,
              url: searchResult.context?.url ?? searchResult.contexts[0]?.url ?? "",
            }}
          />
        )}
      </li>
    </StyledListItemRoot>
  );
};

SearchResult.fragments = {
  searchResult: gql`
    fragment SearchResult_SearchResult on SearchResult {
      id
      url
      title
      ... on ArticleSearchResult {
        htmlTitle
      }
      ... on LearningpathSearchResult {
        htmlTitle
      }
      metaDescription
      context {
        contextId
        publicId
        url
        breadcrumbs
        resourceTypes {
          id
          name
        }
      }
      contexts {
        contextId
        publicId
        url
        breadcrumbs
        relevanceId
        resourceTypes {
          id
          name
        }
      }
    }
  `,
};
