/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CardContent, CardHeading, CardImage, CardRoot, Skeleton, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew, constants } from "@ndla/ui";
import ListItemImageFallback from "../../components/ListItemImageFallback";
import { contentTypeMapping } from "../../util/getContentType";

const resourceEmbedTypes = constants.resourceEmbedTypeMapping;

const DescriptionWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "4xsmall",
  },
});

const ActionsWrapper = styled("div", {
  base: {
    placeSelf: "flex-end",
    "& > button, & > a": {
      position: "relative",
    },
  },
});

interface Props {
  id: string;
  link: string;
  title: string;
  resourceImage: { src: string; alt: string };
  description?: string;
  menu?: ReactNode;
  isLoading?: boolean;
  resourceTypes?: { id: string; name: string }[];
}

const StyledSafeLink = styled(SafeLink, {
  base: {
    lineClamp: "1",
  },
});

const StyledDescription = styled(Text, {
  base: {
    lineClamp: "2",
  },
});

const LoadingCardRoot = styled(CardRoot, {
  base: {
    pointerEvents: "none",
  },
});

const StyledCardImage = styled(CardImage, {
  base: {
    height: "surface.3xsmall",
  },
});

const StyledCardContent = styled(CardContent, {
  base: {
    justifyContent: "space-between",
    paddingInline: "xsmall",
  },
  variants: {
    fullSize: {
      true: {
        height: "100%",
      },
    },
  },
});

const TitleWrapper = styled("hgroup", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const BlockResource = ({ id, link, title, resourceImage, description, menu, isLoading, resourceTypes }: Props) => {
  const { t } = useTranslation();
  const firstResourceType = resourceTypes?.[0]?.id ?? "";

  const contentType = useMemo(() => {
    if (!firstResourceType) {
      return constants.contentTypes.MISSING;
    }
    return (
      contentTypeMapping[firstResourceType] ?? resourceEmbedTypes[firstResourceType] ?? contentTypeMapping.default!
    );
  }, [firstResourceType]);

  if (isLoading) {
    return (
      <LoadingCardRoot id={id} aria-label={t("loading")} aria-busy={true}>
        <Skeleton>
          <CardImage src="" alt="" />
        </Skeleton>
        <CardContent>
          <Skeleton>
            <CardHeading>temp</CardHeading>
          </Skeleton>
          <Skeleton css={{ width: "40%" }}>
            <Text>&nbsp;</Text>
          </Skeleton>
          <Skeleton>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
          </Skeleton>
          <Skeleton>
            <Text>&nbsp;</Text>
          </Skeleton>
        </CardContent>
      </LoadingCardRoot>
    );
  }

  return (
    <CardRoot id={id}>
      {resourceImage.src ? (
        <StyledCardImage src={resourceImage.src} height={100} alt={resourceImage.alt} />
      ) : (
        <ListItemImageFallback iconSize="large" contentType={contentType} />
      )}
      <StyledCardContent fullSize={!resourceImage.src}>
        <TitleWrapper>
          <ContentTypeBadgeNew contentType={contentType} />
          <CardHeading
            asChild
            consumeCss
            color={contentType === constants.contentTypes.MISSING ? "text.subtle" : undefined}
          >
            <h2>
              <StyledSafeLink to={link} unstyled css={linkOverlay.raw()}>
                {title}
              </StyledSafeLink>
            </h2>
          </CardHeading>
        </TitleWrapper>
        <DescriptionWrapper>
          <StyledDescription>{description}</StyledDescription>
          <ActionsWrapper>{menu}</ActionsWrapper>
        </DescriptionWrapper>
      </StyledCardContent>
    </CardRoot>
  );
};

export default BlockResource;
