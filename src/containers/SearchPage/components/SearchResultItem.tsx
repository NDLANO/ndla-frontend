/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, fonts, misc, spacing, stackOrder } from "@ndla/core";
import { Additional, Core } from "@ndla/icons/common";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { SafeLink } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { ContentTypeBadge, resourceTypeColor } from "@ndla/ui";
import { SearchItem } from "../searchHelpers";

interface Props {
  item: SearchItem;
  type: string;
}

const ListItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  border: 1px solid ${colors.brand.greyLight};
  border-radius: ${misc.borderRadius};
  padding: 0;
`;

const ImageWrapper = styled.div`
  height: 180px;
  background-color: var(--bg);
  display: grid;
  grid-template-rows: 1fr auto;
  width: 100%;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: ${colors.white};
`;

const ContentTypeBadgeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ContentTypeWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: inherit;
  padding: ${spacing.small} ${spacing.normal};
`;

const ContextList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: 0;
  margin: 0;
  list-style: none;
`;

const ContextListItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.xsmall};
`;

const StyledHeading = styled(Heading)`
  color: ${colors.brand.primary};
  width: fit-content;
  padding: 0px ${spacing.normal};
`;

const ContentWrapper = styled.div`
  padding: 0px ${spacing.normal} ${spacing.small} ${spacing.normal};
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const BreadcrumbText = styled(Text)`
  color: ${colors.text.light};
  font-weight: ${fonts.weight.normal};
`;

const StyledSafeLink = styled(SafeLink)`
  box-shadow: none;
  color: ${colors.brand.primary};

  &::after {
    content: "";
    position: absolute;
    z-index: ${stackOrder.offsetSingle};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &:hover,
  &:focus-within {
    [data-link-text] {
      text-decoration: underline;
      text-underline-offset: 5px;
    }
  }
`;

const ContentTypeText = styled(Text)`
  :not([data-first="true"]) {
    &::before {
      content: "•";
      margin: 0 ${spacing.xxsmall};
    }
  }
`;

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  align-items: flex-start;
`;

const StyledArticle = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledModalButton = styled(ButtonV2)`
  z-index: ${stackOrder.offsetSingle};
  position: relative;
`;

const SearchResultItem = ({ item, type }: Props) => {
  const { t } = useTranslation();
  const contentType = type === "topic-article" ? "topic" : type;
  const mainContext = item.contexts?.[0];
  const labels = [t(`contentTypes.${contentType}`)].concat(item.labels);

  return (
    <ListItem>
      <StyledArticle>
        <StyledHeader>
          <ImageWrapper style={{ "--bg": resourceTypeColor(contentType) } as CSSProperties}>
            {item.img ? (
              <StyledImage src={item.img.url} alt={item.img.alt} />
            ) : (
              <ContentTypeBadgeWrapper>
                <ContentTypeBadge size="large" type={contentType} border={false} />
              </ContentTypeBadgeWrapper>
            )}
            <ContentTypeWrapper>
              {item.img && <ContentTypeBadge type={contentType} size="small" border={false} />}
              {labels.map((label, index) => (
                <ContentTypeText key={label} textStyle="meta-text-xsmall" margin="none" data-first={!index}>
                  {label}
                </ContentTypeText>
              ))}
            </ContentTypeWrapper>
          </ImageWrapper>
          <StyledSafeLink to={item.url}>
            <StyledHeading element="h3" headingStyle="h4" margin="none" data-link-text="">
              {item.title}
            </StyledHeading>
          </StyledSafeLink>
        </StyledHeader>
        <ContentWrapper>
          {parse(item.ingress)}
          <BreadcrumbText element="span" margin="none" textStyle="meta-text-xsmall">
            {mainContext?.breadcrumb.join(" › ")}
            &nbsp;
            {item.contexts && item.contexts.length > 1 && (
              <Modal>
                <ModalTrigger>
                  <StyledModalButton variant="link">
                    {t("searchPage.contextModal.button", {
                      count: item.contexts.length - 1,
                    })}
                  </StyledModalButton>
                </ModalTrigger>
                <ModalContent>
                  <ModalHeader>
                    <ModalTitle>{t("searchPage.contextModal.heading")}</ModalTitle>
                    <ModalCloseButton />
                  </ModalHeader>
                  <ModalBody>
                    <ContextList>
                      {item.contexts.map((context) => (
                        <ContextListItem key={context.url}>
                          <SafeLink to={context.url}>{item.title}</SafeLink>
                          <BreadcrumbText element="span" margin="none" textStyle="meta-text-small">
                            {context.breadcrumb.join(" › ")}
                            &nbsp;
                            {context.isAdditional ? (
                              <Additional
                                color={colors.brand.dark}
                                size="normal"
                                aria-hidden={false}
                                aria-label={t("resource.tooltipAdditionalTopic")}
                              />
                            ) : (
                              <Core
                                color={colors.brand.primary}
                                size="normal"
                                aria-hidden={false}
                                aria-label={t("resource.tooltipCoreTopic")}
                              />
                            )}
                          </BreadcrumbText>
                        </ContextListItem>
                      ))}
                    </ContextList>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </BreadcrumbText>
        </ContentWrapper>
      </StyledArticle>
    </ListItem>
  );
};

export default SearchResultItem;
