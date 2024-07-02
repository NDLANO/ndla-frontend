/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsxImportSource @emotion/react */
import { ReactNode, useMemo } from "react";
import styled from "@emotion/styled";
import { colors, spacing, stackOrder } from "@ndla/core";
import { Text } from "@ndla/typography";
import { ContentLoader, ContentTypeBadge, Image } from "@ndla/ui";
import {
  ResourceImageProps,
  ContentIconWrapper,
  LoaderProps,
  ResourceTitleLink,
  resourceHeadingStyle,
  ResourceTypeList,
  CompressedTagList,
} from "./resourceComponents";
import { contentTypeMapping, resourceEmbedTypeMapping } from "../../../../util/getContentType";

const BlockElementWrapper = styled.div`
  display: flex;
  position: relative;
  text-decoration: none;
  box-shadow: none;
  flex-direction: column;
  max-width: 450px;
  max-height: 240px;
  border: 1px solid ${colors.brand.light};
  border-radius: 2px;
  color: ${colors.brand.greyDark};
  cursor: pointer;

  &:hover {
    box-shadow: 1px 1px 6px 2px rgba(9, 55, 101, 0.08);
    transition-duration: 0.2s;
    [data-link] {
      color: ${colors.brand.primary};
      text-decoration: underline;
    }
  }

  &:hover,
  &:focus,
  &:focus-within {
    [data-description] {
      /* Unfortunate css needed for multi-line text overflow ellipsis. */
      height: 3.1em;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
`;

const BlockDescription = styled(Text)`
  display: -webkit-box;
  line-clamp: 2;
  height: 0em;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: height 0.2s ease-out;
`;

const TagsAndActionMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: ${stackOrder.offsetSingle};
`;

const BlockInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  margin: ${spacing.small} ${spacing.small} 0 ${spacing.small};
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  align-items: center;
  img {
    object-fit: cover;
    aspect-ratio: 4/3;
    min-width: 100%;
  }
`;

interface BlockImageProps {
  image: ResourceImageProps;
  loading?: boolean;
  contentType: string;
}

const BlockImage = ({ image, loading, contentType }: BlockImageProps) => {
  if (loading) {
    return (
      <ContentLoader height={"100%"} width={"100%"} viewBox={null} preserveAspectRatio="none">
        <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
      </ContentLoader>
    );
  }
  if (image.src === "") {
    return (
      <ContentIconWrapper contentType={contentType}>
        <ContentTypeBadge type={contentType} size="large" />
      </ContentIconWrapper>
    );
  }
  return <Image alt={image.alt} src={image.src} fallbackWidth={300} />;
};

const ResourceTypeAndTitleLoader = ({ children, loading }: LoaderProps) => {
  if (loading) {
    return (
      <ContentLoader height={"18px"} width={"100%"} viewBox={null} preserveAspectRatio="none">
        <rect x="0" y="0" rx="3" ry="3" width="20%" height="18px" />
        <rect x="25%" y="0" rx="3" ry="3" width="20%" height="18px" />
      </ContentLoader>
    );
  }

  return <>{children}</>;
};

interface Props {
  id: string;
  link: string;
  tagLinkPrefix?: string;
  title: string;
  resourceImage: ResourceImageProps;
  tags?: string[];
  description?: string;
  menu?: ReactNode;
  isLoading?: boolean;
  targetBlank?: boolean;
  resourceTypes?: { id: string; name: string }[];
}

const MISSING = "missing";

const BlockResource = ({
  id,
  link,
  tagLinkPrefix,
  title,
  tags,
  resourceImage,
  description,
  menu,
  isLoading,
  targetBlank,
  resourceTypes,
}: Props) => {
  const firstResourceType = resourceTypes?.[0]?.id ?? "";

  const contentType = useMemo(() => {
    if (!firstResourceType) {
      return MISSING;
    }
    return (
      contentTypeMapping[firstResourceType] ??
      resourceEmbedTypeMapping[firstResourceType] ??
      contentTypeMapping.default!
    );
  }, [firstResourceType]);

  return (
    <BlockElementWrapper id={id}>
      <ImageWrapper>
        <BlockImage image={resourceImage} loading={isLoading} contentType={contentType} />
      </ImageWrapper>
      <BlockInfoWrapper>
        <ContentWrapper>
          <ResourceTypeAndTitleLoader loading={isLoading}>
            <ResourceTitleLink
              data-link=""
              title={title}
              target={targetBlank ? "_blank" : undefined}
              to={link}
              data-resource-available={contentType !== MISSING}
            >
              <Text element="span" textStyle="label-small" css={resourceHeadingStyle}>
                {title}
              </Text>
            </ResourceTitleLink>
          </ResourceTypeAndTitleLoader>
          <ResourceTypeList resourceTypes={resourceTypes} />
          <BlockDescription element="p" textStyle="meta-text-small" margin="none" data-description="">
            {description}
          </BlockDescription>
        </ContentWrapper>
        <TagsAndActionMenu>
          {tags && tags.length > 0 && <CompressedTagList tagLinkPrefix={tagLinkPrefix} tags={tags} />}
          {menu}
        </TagsAndActionMenu>
      </BlockInfoWrapper>
    </BlockElementWrapper>
  );
};

export default BlockResource;
