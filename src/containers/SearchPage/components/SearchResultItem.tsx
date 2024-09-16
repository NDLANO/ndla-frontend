/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { Additional, Core } from "@ndla/icons/common";
import {
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
import { ContentTypeBadgeNew } from "@ndla/ui";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { SearchItem } from "../searchHelpers";

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

// TODO: Should this styling be updated?
const StyledButton = styled(Button, {
  base: {
    position: "relative",
    minHeight: "0",
    paddingBlock: "0",
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
  base: { height: "100%" },
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
        {item.img && <CardImage alt={item.img.alt} height={200} src={item.img.url} />}
        <CardContent>
          <ContentTypeBadgeNew contentType={contentType}>{t(`contentTypes.${contentType}`)}</ContentTypeBadgeNew>
          <CardHeading asChild consumeCss>
            <h3>
              <SafeLink to={item.url} unstyled css={linkOverlay.raw()}>
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
                            <SafeLink to={context.url}>{item.title}</SafeLink>
                            <Text
                              textStyle="label.small"
                              aria-label={`${t("breadcrumb.breadcrumb")}: ${context.breadcrumb.join(", ")}. ${context.isAdditional ? t("resource.tooltipAdditionalTopic") : t("resource.tooltipCoreTopic")}`}
                            >
                              {context.breadcrumb.join(" › ")}
                              &nbsp;
                              {context.isAdditional ? <Additional /> : <Core />}
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
