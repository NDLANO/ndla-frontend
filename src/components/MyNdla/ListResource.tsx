/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ListItemContent,
  ListItemHeading,
  ListItemImage,
  ListItemRoot,
  ListItemVariantProps,
  Skeleton,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew, constants } from "@ndla/ui";
import ListItemImageFallback from "../../components/ListItemImageFallback";

const resourceEmbedTypeMapping = constants.resourceEmbedTypeMapping;

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4xsmall",
    width: "100%",
  },
});

export interface ListResourceProps {
  id: string;
  link: string;
  title: string;
  resourceImage: { src: string; alt: string };
  resourceTypes: { id: string; name: string }[];
  description?: string;
  menu?: ReactNode;
  isLoading?: boolean;
}

const StyledSafeLink = styled(SafeLink, {
  base: {
    lineClamp: "1",
    overflowWrap: "anywhere",
  },
});

const StyledDescription = styled(Text, {
  base: {
    width: "100%",
    lineClamp: "2",
    overflowWrap: "anywhere",
  },
});

const ActionWrapper = styled("div", {
  base: {
    "& > button, & > a": {
      position: "relative",
    },
  },
});

const BigListItemImage = styled(ListItemImage, {
  base: {
    tabletWide: {
      minWidth: "102px",
      maxWidth: "102px",
      minHeight: "77px",
      maxHeight: "77px",
    },
  },
});

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
    gap: "4xsmall",
    alignSelf: "flex-start",
    alignItems: "flex-start",
    tablet: {
      flexDirection: "row",
    },
  },
});

const LoadingListItemRoot = styled(ListItemRoot, {
  base: {
    pointerEvents: "none",
  },
});

const ListResource = ({
  id,
  link,
  title,
  resourceImage,
  resourceTypes,
  description,
  menu,
  variant = "list",
  isLoading = false,
}: ListResourceProps & ListItemVariantProps) => {
  const { t } = useTranslation();
  const showDescription = description !== undefined;
  const imageType = showDescription ? "normal" : "compact";
  const firstContentType = resourceTypes?.[0]?.id ?? "";

  const ImageComponent = imageType === "compact" ? ListItemImage : BigListItemImage;

  const contentType = useMemo(() => {
    if (!firstContentType) {
      return constants.contentTypes.MISSING;
    }
    return (
      constants.contentTypeMapping[firstContentType] ??
      resourceEmbedTypeMapping[firstContentType] ??
      constants.contentTypeMapping.default!
    );
  }, [firstContentType]);

  if (isLoading) {
    return (
      <LoadingListItemRoot aria-label={t("loading")} aria-busy={true} variant={variant}>
        <Skeleton>
          <ListItemImage src="" alt="" />
        </Skeleton>
        <StyledListItemContent>
          <TitleWrapper>
            <Skeleton css={{ width: "40%" }}>
              <ListItemHeading>&nbsp;</ListItemHeading>
            </Skeleton>
            <Skeleton>
              <ContentTypeBadgeNew contentType={"missing"} />
            </Skeleton>
          </TitleWrapper>
        </StyledListItemContent>
      </LoadingListItemRoot>
    );
  }

  return (
    <ListItemRoot id={id} variant={variant}>
      {resourceImage.src !== "" ? (
        <ImageComponent src={resourceImage.src} alt="" fallbackWidth={imageType === "compact" ? 56 : 136} />
      ) : (
        <ListItemImageFallback contentType={contentType} iconSize={imageType === "compact" ? "small" : "medium"} />
      )}
      <StyledListItemContent>
        <TitleWrapper>
          <ListItemHeading
            asChild
            consumeCss
            color={contentType === constants.contentTypes.MISSING ? "text.subtle" : undefined}
          >
            <h2>
              <StyledSafeLink to={link} unstyled css={linkOverlay.raw()}>
                {title}
              </StyledSafeLink>
            </h2>
          </ListItemHeading>
          <ContentTypeBadgeNew contentType={contentType} />
        </TitleWrapper>
        {!!description && <StyledDescription>{description}</StyledDescription>}
      </StyledListItemContent>
      <ActionWrapper>{menu}</ActionWrapper>
    </ListItemRoot>
  );
};

export default ListResource;
