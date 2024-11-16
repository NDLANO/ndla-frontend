/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { CardContent, CardHeading, CardRoot, Text, Heading, CardImage } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeFallbackIcon } from "../../../components/ContentTypeFallbackIcon";
import { useEnablePrettyUrls } from "../../../components/PrettyUrlsContext";
import { GQLMultidisciplinaryArticleList_NodeFragment } from "../../graphqlTypes";

const CardList = styled("ul", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "medium",
    tablet: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    desktop: {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  },
});

export interface ListProps {
  nodes: GQLMultidisciplinaryArticleList_NodeFragment[];
}

const ListWrapper = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const MultidisciplinaryArticleList = ({ nodes }: ListProps) => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const id = useId();
  return (
    <ListWrapper aria-labelledby={id}>
      <Heading id={id} textStyle="title.large" asChild consumeCss>
        <h2>{t("multidisciplinary.casesCount", { count: nodes.length })}</h2>
      </Heading>
      <CardList>
        {nodes.map((node) => (
          <li key={node.id}>
            <CardRoot css={{ height: "100%" }}>
              {!!node.meta?.metaImage && (
                <CardImage
                  src={node.meta.metaImage.url}
                  alt={node.meta.metaImage.alt}
                  height={200}
                  fallbackWidth={360}
                  fallbackElement={<ContentTypeFallbackIcon />}
                />
              )}
              <CardContent>
                <CardHeading asChild consumeCss>
                  <h3>
                    <SafeLink to={(enablePrettyUrls ? node.url : node.path) ?? ""} css={linkOverlay.raw()}>
                      {node.name}
                    </SafeLink>
                  </h3>
                </CardHeading>
                <Text textStyle="body.large" css={{ flex: "1" }}>
                  {node.meta?.metaDescription ?? ""}
                </Text>
              </CardContent>
            </CardRoot>
          </li>
        ))}
      </CardList>
    </ListWrapper>
  );
};

MultidisciplinaryArticleList.fragments = {
  node: gql`
    fragment MultidisciplinaryArticleList_Node on Node {
      id
      name
      path
      url
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
    }
  `,
};

export default MultidisciplinaryArticleList;
