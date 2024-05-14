/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import { Additional } from "@ndla/icons/common";
import { EmbedMetaData } from "@ndla/types-embed";
import { Text, Heading } from "@ndla/typography";
import { ContentLoader } from "@ndla/ui";
import TopicMetaImage from "./TopicMetaImage";
import { useIsNdlaFilm } from "../../routeHelpers";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const frameStyle = css`
  ${mq.range({ from: breakpoints.tabletWide })} {
    padding: 40px 40px;
    border: 2px solid ${colors.brand.neutral7};
  }
  ${mq.range({ from: breakpoints.desktop })} {
    padding: 40px 80px;
  }
  ${mq.range({ from: "1180px" })} {
    padding: 60px 160px;
  }
`;

const _invertedStyle = css`
  color: ${colors.white};
`;

const TopicIntroductionWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  justify-content: space-between;
`;

const HeadingWrapper = styled.hgroup`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.small};
`;

const StyledAdditional = styled(Additional)`
  color: ${colors.brand.dark};
  height: ${spacing.normal};
  width: ${spacing.normal};
  padding: 1px;
`;

export type TopicProps = {
  id?: string;
  metaImage?: {
    url: string;
    alt: string;
  };
  title: ReactNode;
  introduction: ReactNode;
  visualElementEmbedMeta?: EmbedMetaData;
  isLoading?: boolean;
  isAdditionalTopic?: boolean;
  frame?: boolean;
  children?: ReactNode;
  visualElement?: ReactNode;
};

const Topic = ({
  id,
  title,
  introduction,
  metaImage: articleMetaImage,
  isAdditionalTopic,
  isLoading,
  frame,
  visualElementEmbedMeta,
  children,
  visualElement,
}: TopicProps) => {
  const { t } = useTranslation();
  const inverted = useIsNdlaFilm();

  const wrapperStyle = [frame ? frameStyle : undefined, inverted ? _invertedStyle : undefined];
  if (isLoading) {
    return (
      <Wrapper css={wrapperStyle}>
        <ContentLoader width={800} height={880}>
          <rect x="0" y="0" rx="3" ry="3" width="500" height="60" />
          <rect x="0" y="100" rx="3" ry="3" width="500" height="25" />
          <rect x="0" y="140" rx="3" ry="3" width="500" height="25" />
          <rect x="0" y="180" rx="3" ry="3" width="400" height="25" />
          <rect x="600" y="0" rx="3" ry="3" width="200" height="205" />
          <rect x="0" y="280" rx="3" ry="3" width="800" height="60" />
          <rect x="0" y="350" rx="3" ry="3" width="800" height="60" />
          <rect x="0" y="420" rx="3" ry="3" width="800" height="60" />
          <rect x="0" y="490" rx="3" ry="3" width="800" height="60" />
          <rect x="0" y="560" rx="3" ry="3" width="800" height="60" />
          <rect x="0" y="680" rx="3" ry="3" width="800" height="60" />
          <rect x="0" y="750" rx="3" ry="3" width="800" height="60" />
          <rect x="0" y="820" rx="3" ry="3" width="800" height="60" />
        </ContentLoader>
      </Wrapper>
    );
  }

  return (
    <Wrapper css={wrapperStyle}>
      <TopicIntroductionWrapper>
        <div>
          <HeadingWrapper>
            <Heading element="h1" margin="none" headingStyle="h2" id={id} tabIndex={-1}>
              {title}
            </Heading>
            {isAdditionalTopic && (
              <>
                <StyledAdditional aria-hidden="true" />
                <span>{t("navigation.additionalTopic")}</span>
              </>
            )}
          </HeadingWrapper>
          <Text textStyle="ingress" element="div">
            {introduction}
          </Text>
        </div>
        {!!visualElementEmbedMeta && !!articleMetaImage && (
          <TopicMetaImage
            visualElementEmbedMeta={visualElementEmbedMeta}
            metaImage={articleMetaImage}
            visualElement={visualElement}
          />
        )}
      </TopicIntroductionWrapper>
      {children}
    </Wrapper>
  );
};

export default Topic;
