/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { CardContent, CardHeading, CardImage, CardRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew } from "@ndla/ui";

const StyledCardRoot = styled(CardRoot, {
  base: {
    border: "0",
  },
});

// TODO: Consider if ingress should be renderer as HTML.
// TODO: Consider if we should render additional here.

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column-reverse",
    tablet: {
      flexDirection: "row",
    },
  },
});

const StyledList = styled("ul", {
  base: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    rowGap: "xxsmall",
    tablet: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: "xsmall",
    },
  },
});

const StyledLi = styled("li", {
  base: {
    tablet: {
      paddingInlineEnd: "xsmall",
      borderRight: "1px solid",
      borderColor: "stroke.subtle",
      _last: {
        paddingInlineEnd: "0px",
        borderInlineEnd: "0",
      },
    },
  },
});

interface Props {
  title: string;
  url: string;
  ingress: string;
  contentType?: string;
  metaImage?: {
    url?: string;
    alt?: string;
  };
  subjects?: {
    url?: string;
    title?: string;
  }[];
}

export const MovedNodeCard = ({ title, url, ingress, subjects, contentType, metaImage }: Props) => {
  const urlLabelId = useId();
  const { t } = useTranslation();

  return (
    <StyledCardRoot>
      <Wrapper>
        <CardContent>
          {!!contentType && <ContentTypeBadgeNew contentType={contentType} />}
          <CardHeading asChild consumeCss>
            <h2>
              <SafeLink to={url} css={linkOverlay.raw()}>
                {title}
              </SafeLink>
            </h2>
          </CardHeading>
          <Text>{ingress}</Text>
        </CardContent>
        {!!metaImage?.url && <CardImage src={metaImage.url} width={300} alt={metaImage?.alt ?? ""} />}
      </Wrapper>
      {!!subjects?.length && (
        <CardContent>
          <Text id={urlLabelId} textStyle="label.medium" fontWeight="bold">
            {t("searchPage.searchResultListMessages.subjectsLabel")}
          </Text>
          <nav aria-labelledby={urlLabelId}>
            <StyledList>
              {subjects.map((subject) => (
                <StyledLi key={subject.url}>
                  <SafeLink to={subject.url ?? ""}>{subject.title}</SafeLink>
                </StyledLi>
              ))}
            </StyledList>
          </nav>
        </CardContent>
      )}
    </StyledCardRoot>
  );
};
