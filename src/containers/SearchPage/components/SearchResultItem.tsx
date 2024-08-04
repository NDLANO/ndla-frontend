/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { Cross } from "@ndla/icons/action";
import { Additional, Core } from "@ndla/icons/common";
import {
  Button,
  CardContent,
  CardHeading,
  CardImage,
  CardRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew } from "@ndla/ui";
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
const StyledButton = styled(Button, { base: { position: "relative", minHeight: "0", paddingBlock: "0" } });

const FullHeightListElement = styled("li", { base: { height: "100%", minHeight: "surface.3xsmall" } });
const FullheightCardRoot = styled(CardRoot, { base: { height: "100%" } });

const SearchResultItem = ({ item, type }: Props) => {
  const { t } = useTranslation();
  const contentType = type === "topic-article" ? "topic" : type;
  const mainContext = item.contexts?.[0];

  return (
    <FullHeightListElement>
      <FullheightCardRoot>
        {item.img && <CardImage alt={item.img.alt} height={200} src={item.img.url} />}
        <CardContent>
          <ContentTypeBadgeNew contentType={contentType}>{t(`contentTypes.${contentType}`)}</ContentTypeBadgeNew>
          <CardHeading>
            <SafeLink to={item.url} unstyled css={linkOverlay.raw()}>
              {item.title}
            </SafeLink>
          </CardHeading>
          {item.ingress && <Text>{parse(item.ingress)}</Text>}
          <Text color="text.subtle" textStyle="label.small">
            {mainContext?.breadcrumb.join(" › ")}
            {item.contexts && item.contexts.length > 1 && (
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
                    {/* TODO: Replace with DialogCloseButton */}
                    <DialogCloseTrigger asChild>
                      <IconButton variant="clear">
                        <Cross />
                      </IconButton>
                    </DialogCloseTrigger>
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
          </Text>
          <LtiWrapper>{item.children}</LtiWrapper>
        </CardContent>
      </FullheightCardRoot>
    </FullHeightListElement>
  );
};

export default SearchResultItem;
