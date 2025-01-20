/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { ArrowRightShortLine } from "@ndla/icons";
import { Figure, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ArticleContent, ArticleTitle, ArticleWrapper } from "@ndla/ui";
import { EmbedPageContent } from "./LearningpathEmbed";
import { GQLLearningpathEmbed_LearningpathStepFragment } from "../../graphqlTypes";

const StyledSafeLink = styled(SafeLink, {
  base: {
    textDecoration: "underline",
    textStyle: "label.large",
    color: "text.link",
    fontWeight: "bold",
    _hover: {
      textDecoration: "unset",
    },
  },
});

const LinkWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "xsmall",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "xxsmall",
  },
});

const Wrapper = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    gap: "small",
    flexDirection: "column",
    backgroundColor: "surface.brand.2.subtle",
    borderRadius: "xxsmall",
    padding: "medium",
    border: "1px solid",
    borderColor: "stroke.info",
  },
});

const UrlText = styled(Text, {
  base: {
    lineClamp: "1",
    overflow: "hidden",
  },
});

interface Props {
  learningpathStep?: GQLLearningpathEmbed_LearningpathStepFragment;
  skipToContentId?: string;
}

export const LearningpathExternal = ({ learningpathStep, skipToContentId }: Props) => {
  const fallbackId = useId();
  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={skipToContentId ?? fallbackId}
          contentType="external"
          title={learningpathStep?.title}
          introduction={learningpathStep?.introduction}
        />
        <ArticleContent>
          <section>
            <Figure data-embed-type="external">
              <Wrapper>
                <LinkWrapper>
                  <TextWrapper>
                    <StyledSafeLink to={learningpathStep?.embedUrl?.url ?? ""} unstyled css={linkOverlay?.raw()}>
                      {learningpathStep?.title}
                    </StyledSafeLink>
                    <Text textStyle="label.medium">{learningpathStep?.introduction}</Text>
                  </TextWrapper>
                  <ArrowRightShortLine />
                </LinkWrapper>
                <UrlText textStyle="label.medium" color="text.subtle">
                  {learningpathStep?.embedUrl?.url}
                </UrlText>
              </Wrapper>
            </Figure>
          </section>
        </ArticleContent>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
