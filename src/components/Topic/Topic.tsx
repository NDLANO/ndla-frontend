/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedMetaData } from "@ndla/types-embed";

const TopicContent = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "medium",
    paddingBlockStart: "medium",
    paddingBlockEnd: "xsmall",
    justifyItems: "center",
    tabletWide: {
      gridTemplateColumns: "auto 360px",
    },
    "& figure": {
      maxWidth: "360px",
    },
  },
});

const TopicIntroductionWrapper = styled("div", {
  base: {
    maxWidth: "surface.contentMax",
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const HeadingWrapper = styled("hgroup", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "xsmall",
  },
});

export type TopicProps = {
  id?: string;
  title: ReactNode;
  introduction: ReactNode;
  visualElementEmbedMeta?: EmbedMetaData;
  isAdditionalTopic?: boolean;
  visualElement?: ReactNode;
};

const Topic = forwardRef<HTMLDivElement, TopicProps>(
  ({ id, title, introduction, isAdditionalTopic, visualElement }, ref) => {
    const { t } = useTranslation();

    return (
      <TopicContent ref={ref}>
        <TopicIntroductionWrapper>
          <HeadingWrapper>
            <Heading textStyle="heading.small" id={id} tabIndex={-1}>
              {title}
            </Heading>
            {isAdditionalTopic && <Badge colorTheme="neutral">{t("navigation.additionalTopic")}</Badge>}
          </HeadingWrapper>
          <Text textStyle="body.xlarge" asChild consumeCss>
            <div>{introduction}</div>
          </Text>
        </TopicIntroductionWrapper>
        {visualElement}
      </TopicContent>
    );
  },
);

export default Topic;
