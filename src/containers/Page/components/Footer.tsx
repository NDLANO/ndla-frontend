/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useId } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ZendeskButton } from "@ndla/button";
import { breakpoints, colors, mq, spacing, stackOrder } from "@ndla/core";
import { FacebookFilled, HelpCircleOutline, Instagram, LinkedIn, Email, Youtube, Launch } from "@ndla/icons/common";
import { SafeLink } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { FooterBlock } from "@ndla/ui";
import config from "../../../config";

const FooterTextWrapper = styled.div`
  grid-column: span 2;
  ${mq.range({ from: breakpoints.tabletWide })} {
    align-self: flex-end;
  }
`;

const ZendeskWrapper = styled.div`
  position: relative;
`;

const FooterGrid = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  ${mq.range({ from: breakpoints.tabletWide })} {
    display: grid;
    grid-template-columns: max-content max-content min-content;
    justify-content: space-between;
    row-gap: ${spacing.normal};
  }
`;

const StyledZendesk = styled(ZendeskButton)`
  border-color: ${colors.brand.secondary};
  position: absolute;
  right: ${spacing.large};
  // Heigth of button is 40px, so this is to center it vertically.
  top: -20px;
  z-index: ${stackOrder.trigger};

  &[disabled] {
    color: ${colors.brand.grey};
    background-color: white;
    border-color: ${colors.brand.secondary};
    cursor: not-allowed;
  }
`;

const StyledHelpCircleOutline = styled(HelpCircleOutline)`
  width: 20px;
  height: 20px;
`;

const StyledLinkBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const LinkList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const StyledSafeLink = styled(SafeLink)`
  color: white;
  box-shadow: none;
  text-decoration: underline;
  text-underline-offset: 5px;
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;

const LinkListElement = styled.li`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
  padding: 0px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

interface FooterLinkBlockProps {
  links: { to: string; text: string; external?: boolean; icon?: ReactNode; asAnchor?: boolean }[];
  label: string;
  className?: string;
}

const FooterLinkBlock = ({ links, label, className }: FooterLinkBlockProps) => {
  const id = useId();
  return (
    <StyledLinkBlock className={className}>
      <Heading id={id} element="span" headingStyle="list-title" margin="none">
        {label}
      </Heading>
      <nav>
        <LinkList>
          {links.map((link, index) => (
            <LinkListElement key={index}>
              {link.icon ? link.icon : null}
              <StyledSafeLink
                to={link.to}
                asAnchor={link.asAnchor}
                target={link.external ? "_blank" : ""}
                rel="noopener noreferrer"
              >
                {link.text}
              </StyledSafeLink>
              {link.external ? <Launch /> : null}
            </LinkListElement>
          ))}
        </LinkList>
      </nav>
    </StyledLinkBlock>
  );
};

const CenteredLinkBlock = styled(FooterLinkBlock)`
  justify-self: center;
`;

const FooterWrapper = () => {
  const { t, i18n } = useTranslation();
  const zendeskLanguage = i18n.language === "nb" || i18n.language === "nn" ? "no" : i18n.language;

  const links = [
    {
      to: "https://www.facebook.com/ndla.no",
      text: t("footer.socialMediaLinks.facebook"),
      icon: <FacebookFilled />,
    },
    {
      to: "https://instagram.com/ndla_no/",
      text: t("footer.socialMediaLinks.instagram"),
      icon: <Instagram />,
    },
    {
      to: "https://www.linkedin.com/company/ndla/",
      text: t("footer.socialMediaLinks.linkedin"),
      icon: <LinkedIn />,
    },
    {
      to: "https://www.youtube.com/channel/UCBlt6T8B0mmvDh3k5q7EhsA",
      text: t("footer.socialMediaLinks.youtube"),
      icon: <Youtube />,
    },
    {
      to: "https://ndla.us6.list-manage.com/subscribe?u=99d41bbb28de0128915adebed&id=9a1d3ad1ea",
      text: t("footer.socialMediaLinks.newsletter"),
      icon: <Email />,
    },
  ];

  const commonLinks = [
    {
      text: t("footer.ndlaLinks.omNdla"),
      to: "https://ndla.no/about/om-ndla",
      external: false,
    },
    {
      text: t("footer.ndlaLinks.aboutNdla"),
      to: "https://ndla.no/about/about-us",
      external: false,
    },
    {
      text: t("footer.ndlaLinks.blog"),
      to: "https://blogg.ndla.no",
      external: true,
    },
    {
      text: t("footer.ndlaLinks.tips"),
      to: "https://blogg.ndla.no/eleverivideregaende/",
      external: true,
    },
    {
      text: t("footer.ndlaLinks.vacancies"),
      to: "https://ndla.no/about/utlysninger",
      external: false,
    },
  ];

  const privacyLinks = [
    {
      to: "https://ndla.no/article/personvernerklaering",
      text: t("footer.privacyLink"),
    },
    {
      to: "https://ndla.no/article/erklaering-for-informasjonskapsler",
      text: t("footer.cookiesLink"),
    },
    {
      to: "https://uustatus.no/nn/erklaringer/publisert/8cefdf3d-3272-402a-907b-689ddfc9bba7",
      text: t("footer.availabilityLink"),
    },
  ];

  // const otherLanguages = [
  //   {
  //     to: "/en/subject:27e8623d-c092-4f00-9a6f-066438d6c466",
  //     text: "Українська",
  //   },
  //   {
  //     to: "/se/subject:e474cd73-5b8a-42cf-b0f1-b027e522057c",
  //     text: "Davvisámegiella",
  //   },
  // ];

  return (
    <footer>
      {config.zendeskWidgetKey && (
        <ZendeskWrapper>
          <StyledZendesk id="zendesk" locale={zendeskLanguage} widgetKey={config.zendeskWidgetKey}>
            <StyledHelpCircleOutline />
            {t("askNDLA")}
          </StyledZendesk>
        </ZendeskWrapper>
      )}
      <FooterBlock>
        <Heading headingStyle="h2" element="span" margin="none">
          {t("footer.vision")}
        </Heading>
        <FooterGrid>
          <FooterLinkBlock links={links} label={t("footer.socialMedia")} />
          <CenteredLinkBlock links={commonLinks} label={t("footer.linksHeader")} />
          <FooterLinkBlock links={privacyLinks} label={t("footer.aboutWebsite")} />
          <FooterTextWrapper>
            <Text textStyle="meta-text-medium" margin="none">
              {t("footer.info")}
            </Text>
            <Text textStyle="meta-text-medium" margin="none">
              <strong>{t("footer.editorInChief")}</strong> Sigurd Trageton
            </Text>
          </FooterTextWrapper>
          {/* <FooterLinkBlock links={otherLanguages} label={t("footer.otherLanguages")} /> */}
        </FooterGrid>
      </FooterBlock>
    </footer>
  );
};

export default FooterWrapper;
