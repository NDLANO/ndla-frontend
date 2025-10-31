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
  Badge,
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
import { BadgesContainer, contentTypeMapping, contentTypes, resourceEmbedTypeMapping } from "@ndla/ui";
import { useListItemTraits } from "../../util/listItemTraits";
import { ContentTypeFallbackIcon } from "../ContentTypeFallbackIcon";

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "3xsmall",
    width: "100%",
  },
});

export interface ListResourceProps {
  id: string;
  link: string;
  title: string;
  resourceImage: { src: string | undefined; alt: string };
  resourceTypes?: { id: string; name: string }[];
  description?: string;
  menu?: ReactNode;
  traits?: string[];
  storedResourceType?: string;
  isLoading?: boolean;
}

const StyledDescription = styled(Text, {
  base: {
    width: "100%",
    lineClamp: "2",
    overflowWrap: "anywhere",
  },
});

const ActionWrapper = styled("div", {
  base: {
    marginInlineStart: "auto",
    "& > button, & > a": {
      position: "relative",
    },
  },
});

const DescriptionWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "3xsmall",
    width: "100%",
  },
});

const StyledListItemImage = styled(ListItemImage, {
  base: {
    tabletDown: {
      display: "none",
    },
  },
});

const StyledListItemHeading = styled(ListItemHeading, {
  base: {
    lineClamp: "2",
    overflowWrap: "anywhere",
  },
});

const LoadingListItemRoot = styled(ListItemRoot, {
  base: {
    pointerEvents: "none",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    tabletDown: {
      "& picture": {
        display: "none",
      },
    },
  },
});

const StyledContentTypeFallbackIcon = styled(ContentTypeFallbackIcon, {
  base: {
    tabletDown: {
      display: "none",
    },
  },
});

const learningpathMapping: Record<string, string> = { learningpath: contentTypes.LEARNING_PATH };

export const ListResource = ({
  id,
  link,
  title,
  resourceImage,
  resourceTypes,
  description,
  menu,
  traits,
  storedResourceType,
  isLoading = false,
  nonInteractive,
}: ListResourceProps & ListItemVariantProps) => {
  const { t } = useTranslation();
  const firstContentType = resourceTypes?.[0]?.id ?? storedResourceType ?? "";

  const contentType = useMemo(() => {
    if (!firstContentType) {
      return contentTypes.MISSING;
    }
    return (
      contentTypeMapping[firstContentType] ??
      resourceEmbedTypeMapping[firstContentType] ??
      learningpathMapping[firstContentType] ??
      contentTypeMapping.default!
    );
  }, [firstContentType]);

  const listItemTraits = useListItemTraits({ traits, resourceTypes, contentType, resourceType: storedResourceType });

  if (isLoading) {
    return (
      <LoadingListItemRoot aria-label={t("loading")} aria-busy={true} nonInteractive={nonInteractive}>
        <Skeleton>
          <ListItemImage alt="" />
        </Skeleton>
        <StyledListItemContent>
          <Skeleton css={{ width: "40%" }}>
            <ListItemHeading>&nbsp;</ListItemHeading>
          </Skeleton>
          <Skeleton>{<Badge>{t("contentTypes.missing")}</Badge>}</Skeleton>
        </StyledListItemContent>
      </LoadingListItemRoot>
    );
  }

  return (
    <StyledListItemRoot id={id} nonInteractive={nonInteractive}>
      <StyledListItemImage
        src={resourceImage.src}
        alt=""
        fallbackElement={<StyledContentTypeFallbackIcon contentType={contentType} />}
      />
      <StyledListItemContent>
        {nonInteractive ? (
          <StyledListItemHeading color={contentType === contentTypes.MISSING ? "text.subtle" : undefined}>
            {title}
          </StyledListItemHeading>
        ) : (
          <StyledListItemHeading
            asChild
            consumeCss
            css={linkOverlay.raw()}
            color={contentType === contentTypes.MISSING ? "text.subtle" : undefined}
          >
            <SafeLink to={link}>{title}</SafeLink>
          </StyledListItemHeading>
        )}

        <DescriptionWrapper>
          {!!description && <StyledDescription>{description}</StyledDescription>}
          <ActionWrapper>{menu}</ActionWrapper>
        </DescriptionWrapper>
        <BadgesContainer>
          {listItemTraits.map((trait) => (
            <Badge key={`${id}-${trait}`}>{trait}</Badge>
          ))}
        </BadgesContainer>
      </StyledListItemContent>
    </StyledListItemRoot>
  );
};
