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
import { constants } from "@ndla/ui";
import { useListItemTraits } from "../../util/listItemTraits";
import { ContentTypeFallbackIcon } from "../ContentTypeFallbackIcon";
import { TraitsContainer } from "../TraitsContainer";

const resourceEmbedTypeMapping = constants.resourceEmbedTypeMapping;

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
const StyledSafeLink = styled(SafeLink, {
  base: {
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

const BigListItemImage = styled(ListItemImage, {
  base: {
    tabletDown: {
      display: "none",
    },
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
    width: "100%",
    justifyContent: "space-between",
    gap: "3xsmall",
    alignItems: "flex-start",
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

const learningpathMapping: Record<string, string> = { learningpath: constants.contentTypes.LEARNING_PATH };

export const ListResource = ({
  id,
  link,
  title,
  resourceImage,
  resourceTypes,
  description,
  menu,
  variant,
  traits,
  context = "list",
  storedResourceType,
  isLoading = false,
  nonInteractive,
}: ListResourceProps & ListItemVariantProps) => {
  const { t } = useTranslation();
  const firstContentType = resourceTypes?.[0]?.id ?? storedResourceType ?? "";

  const contentType = useMemo(() => {
    if (!firstContentType) {
      return constants.contentTypes.MISSING;
    }
    return (
      constants.contentTypeMapping[firstContentType] ??
      resourceEmbedTypeMapping[firstContentType] ??
      learningpathMapping[firstContentType] ??
      constants.contentTypeMapping.default!
    );
  }, [firstContentType]);

  const listItemTraits = useListItemTraits({ traits, resourceTypes, contentType, resourceType: storedResourceType });

  if (isLoading) {
    return (
      <LoadingListItemRoot
        aria-label={t("loading")}
        aria-busy={true}
        variant={variant}
        context={context}
        nonInteractive={nonInteractive}
      >
        <Skeleton>
          <ListItemImage alt="" />
        </Skeleton>
        <StyledListItemContent>
          <TitleWrapper>
            <Skeleton css={{ width: "40%" }}>
              <ListItemHeading>&nbsp;</ListItemHeading>
            </Skeleton>
            <Skeleton>{<Badge>{t("contentTypes.missing")}</Badge>}</Skeleton>
          </TitleWrapper>
        </StyledListItemContent>
      </LoadingListItemRoot>
    );
  }

  return (
    <StyledListItemRoot id={id} variant={variant} context={context} nonInteractive={nonInteractive}>
      <BigListItemImage
        src={resourceImage.src}
        alt=""
        fallbackWidth={136}
        fallbackElement={<StyledContentTypeFallbackIcon contentType={contentType} />}
      />
      <StyledListItemContent>
        <TitleWrapper>
          {nonInteractive ? (
            <ListItemHeading color={contentType === constants.contentTypes.MISSING ? "text.subtle" : undefined}>
              {title}
            </ListItemHeading>
          ) : (
            <ListItemHeading
              asChild
              consumeCss
              color={contentType === constants.contentTypes.MISSING ? "text.subtle" : undefined}
            >
              <StyledSafeLink to={link} unstyled css={linkOverlay.raw()}>
                {title}
              </StyledSafeLink>
            </ListItemHeading>
          )}
        </TitleWrapper>
        <DescriptionWrapper>
          {!!description && <StyledDescription>{description}</StyledDescription>}
          <ActionWrapper>{menu}</ActionWrapper>
        </DescriptionWrapper>
        <TraitsContainer>
          {listItemTraits.map((trait) => (
            <Badge key={`${id}-${trait}`}>{trait}</Badge>
          ))}
        </TraitsContainer>
      </StyledListItemContent>
    </StyledListItemRoot>
  );
};
