/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedMetaData } from "@ndla/types-embed";
import { LayoutItem } from "@ndla/ui";

// TODO: Figure out how we should handle margin here.

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
    paddingBlockStart: "medium",
    paddingBlockEnd: "xsmall",
  },
});

const TopicContent = styled(LayoutItem, {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "medium",
    justifyContent: "space-between",
    desktop: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
});

const TopicIntroductionWrapper = styled("div", {
  base: {
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
  children?: ReactNode;
  visualElement?: ReactNode;
};

const Topic = ({ id, title, introduction, isAdditionalTopic, children, visualElement }: TopicProps) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <TopicContent layout="extend">
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
      {children}
    </Wrapper>
  );
};

export default Topic;
