/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import {
  BlockQuoteVariantProps,
  Button,
  CardContent,
  CardHeading,
  CardImage,
  CardRoot,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentType } from "@ndla/ui";
import { ContentTypeFallbackIcon } from "../../../components/ContentTypeFallbackIcon";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { SearchItem } from "../searchHelpers";

const contentTypeToVariantMapping = {
  "subject-material": "brand1",
  "source-material": "brand1",
  concept: "brand1",
  "tasks-and-activities": "brand2",
  "assessment-resources": "brand2",
  subject: "info",
  "topic-article": "info",
  "learning-path": "brand3",
} as Record<
  ContentType | "subject" | "topic-article" | "learning-path",
  NonNullable<BlockQuoteVariantProps>["variant"] | "brand3" | "info"
>;

interface Props {
  item: SearchItem;
  type: string;
}
const LtiWrapper = styled("div", {
  base: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "& > button": { width: "100%" },
  },
});

const StyledButton = styled(Button, {
  base: {
    position: "relative",
    marginInlineStart: "4xsmall",
  },
});

const StyledListElement = styled("li", {
  base: {
    height: "100%",
    minHeight: "surface.3xsmall",
  },
});

const StyledCardRoot = styled(CardRoot, {
  base: {
    height: "100%",
    _hover: {
      backgroundColor: "surface.default",
      borderColor: "stroke.hover",
      boxShadow: "xsmall",
    },
  },
});

const Metadata = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "5xsmall",
    paddingInline: "medium",
    paddingBlockStart: "xsmall",
    paddingBlockEnd: "small",
    borderBlockStart: "1px solid",
    borderBlockStartColor: "stroke.subtle",
    boxShadow: "inner",
    minHeight: "65px", // placeholder
  },
  variants: {
    variant: {
      neutral: {
        borderColor: "stroke.subtle",
        background: "surface.default",
      },
      brand1: {
        background: "surface.brand.1.subtle",
        borderColor: "surface.brand.1.strong",
      },
      brand2: {
        background: "surface.brand.2.subtle",
        borderColor: "surface.brand.2.strong",
      },
      brand3: {
        background: "surface.brand.3.subtle",
        borderColor: "surface.brand.3.strong",
      },
      info: {
        background: "surface.infoSubtle",
        borderColor: "surface.infoSubtle",
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const StyledText = styled(Text, {
  base: {
    "& > div": {
      color: "text.default",
    },
  },
});

const SearchResultItem = ({ item, type }: Props) => {
  const { t } = useTranslation();
  const contentType = type === "topic-article" ? "topic" : type;
  const mainContext = item.contexts?.[0];

  return (
    <StyledListElement>
      <StyledCardRoot>
        <CardImage
          alt=""
          height={200}
          src={item.img?.url ?? item.metaImg ?? ""}
          sizes={"320px"}
          fallbackElement={<ContentTypeFallbackIcon contentType={contentType} />}
        />
        <Metadata variant={contentTypeToVariantMapping[contentType]}>
          <StyledText textStyle="label.small">{t(`contentTypes.${contentType}`)}</StyledText>
          {item.labels && item.labels?.length > 1 && (
            <StyledText textStyle="label.xsmall">
              {t(`searchPage.includes `)}
              {item.labels?.map((label, index) => (
                <span key={index}>
                  {label}
                  {item.labels && index < item.labels.length - 1 && ", "}
                </span>
              ))}
            </StyledText>
          )}
        </Metadata>
        <CardContent>
          <CardHeading asChild consumeCss>
            <h3>
              <SafeLink to={item.url || ""} unstyled css={linkOverlay.raw()}>
                {item.title}
              </SafeLink>
            </h3>
          </CardHeading>
          {!!item.ingress && <Text>{parse(item.ingress)}</Text>}
          {!!item.contexts?.length && (
            <StyledText color="text.subtle" textStyle="label.small">
              {mainContext?.breadcrumb.join(" › ")}
              {item.contexts.length > 1 && (
                <DialogRoot>
                  <DialogTrigger asChild>
                    <StyledButton variant="link">
                      {t("searchPage.contextModal.button", {
                        count: item.contexts.length - 1,
                      })}
                    </StyledButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("searchPage.contextModal.heading")}</DialogTitle>
                      <DialogCloseButton />
                    </DialogHeader>
                    <DialogBody>
                      <ul>
                        {item.contexts.map((context) => (
                          <li key={context.url}>
                            <SafeLink to={context.url || ""}>{item.title}</SafeLink>
                            <Text
                              textStyle="label.small"
                              aria-label={`${t("breadcrumb.breadcrumb")}: ${context.breadcrumb.join(", ")}. ${context.isAdditional ? t("resource.tooltipAdditionalTopic") : t("resource.tooltipCoreTopic")}`}
                            >
                              {context.breadcrumb.join(" › ")}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </DialogBody>
                  </DialogContent>
                </DialogRoot>
              )}
            </StyledText>
          )}
          <LtiWrapper>{item.children}</LtiWrapper>
        </CardContent>
      </StyledCardRoot>
    </StyledListElement>
  );
};

export default SearchResultItem;
