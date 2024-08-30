/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { QuestionLine, InstagramLine, LinkedinBoxLine, MailLine, YoutubeLine, Facebook } from "@ndla/icons/common";
import { Heading, NdlaLogoEn, NdlaLogoNb, PageContent, Text } from "@ndla/primitives";
import { SafeLink, SafeLinkIconButton } from "@ndla/safelink";
import { css } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { ZendeskButton } from "@ndla/ui";
import config from "../../../config";

// TODO: Add new translations for the footer.

export const FooterBlock = styled("footer", {
  base: {
    position: "relative",
    background: "primary",
    color: "text.onAction",
  },
});

const FooterWrapper = styled("div", {
  base: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBlock: "xxlarge",
    tablet: {
      paddingBlock: "4xlarge",
    },
    desktopDown: {
      flexDirection: "column-reverse",
      gap: "xxlarge",
    },
    "& a:focus-visible": {
      outlineColor: "surface.default",
    },
  },
});

const FooterTextWrapper = styled("div", {
  base: {
    tabletWide: {
      alignSelf: "flex-end",
    },
    desktop: {
      gridColumn: "span 2",
    },
  },
});

const StyledZendesk = styled(ZendeskButton, {
  base: {
    position: "absolute",
    right: "xxlarge",
    top: "-medium",
    zIndex: "docked",
  },
});

const StyledLinkBlock = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const LinkList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "inline",
    color: "text.onAction",
    textStyle: "body.link",
    textDecoration: "underline",
    "& svg": {
      marginInlineStart: "xsmall",
    },
    _hover: {
      textDecoration: "none",
    },
    _focusVisible: {
      textDecoration: "none",
    },
  },
});

interface FooterLinkBlockProps {
  links: { to: string; text: string }[];
  label: string;
}

const FooterLinkBlock = ({ links, label }: FooterLinkBlockProps) => {
  const id = useId();
  return (
    <StyledLinkBlock>
      {/* TODO: Consider if this should be an actual heading */}
      <Heading id={id} asChild consumeCss textStyle="label.large" fontWeight="bold">
        <span>{label}</span>
      </Heading>
      <nav aria-labelledby={id}>
        <LinkList>
          {links.map((link, index) => (
            <li key={index}>
              <StyledSafeLink to={link.to} rel="noopener noreferrer">
                {link.text}
              </StyledSafeLink>
            </li>
          ))}
        </LinkList>
      </nav>
    </StyledLinkBlock>
  );
};

const SocialMediaLinkList = styled(LinkList, {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

const FooterSocialMedia = () => {
  const id = useId();
  const { t } = useTranslation();

  const links = [
    {
      text: t("footer.socialMediaLinks.facebook"),
      to: "https://www.facebook.com/ndla.no",
      icon: <Facebook />,
    },
    {
      text: t("footer.socialMediaLinks.instagram"),
      to: "https://instagram.com/ndla_no/",
      icon: <InstagramLine />,
    },
    {
      text: t("footer.socialMediaLinks.linkedin"),
      to: "https://www.linkedin.com/company/ndla/",
      icon: <LinkedinBoxLine />,
    },
    {
      text: t("footer.socialMediaLinks.youtube"),
      to: "https://www.youtube.com/channel/UCBlt6T8B0mmvDh3k5q7EhsA",
      icon: <YoutubeLine />,
    },
  ];

  return (
    <StyledLinkBlock>
      {/* TODO: Consider if this should be an actual heading */}
      <Heading id={id} asChild consumeCss textStyle="label.large" fontWeight="bold">
        <span>{t("footer.followUs")}</span>
      </Heading>
      <nav aria-labelledby={id}>
        <SocialMediaLinkList>
          {links.map((link) => (
            <SafeLinkIconButton
              variant="clearSubtle"
              to={link.to}
              title={link.text}
              aria-label={link.text}
              key={link.to}
            >
              {link.icon}
            </SafeLinkIconButton>
          ))}
          <StyledSafeLink
            css={{ width: "100%" }}
            to="https://ndla.us6.list-manage.com/subscribe?u=99d41bbb28de0128915adebed&id=9a1d3ad1ea"
          >
            {t("footer.socialMediaLinks.newsletter")} <MailLine />
          </StyledSafeLink>
        </SocialMediaLinkList>
      </nav>
    </StyledLinkBlock>
  );
};

const StyledHeading = styled(Heading, {
  base: {
    desktopDown: {
      textAlign: "center",
    },
  },
});

const logoStyle = css.raw({
  color: "icon.onAction",
  flexShrink: "0",
  _print: {
    color: "icon.strong",
  },
});

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const zendeskLanguage = i18n.language === "nb" || i18n.language === "nn" ? "no" : i18n.language;

  const Logo = i18n.language === "en" ? NdlaLogoEn : NdlaLogoNb;

  const commonLinks = [
    {
      text: t("footer.ndlaLinks.omNdla"),
      to: "https://ndla.no/about/om-ndla",
    },
    {
      text: t("footer.ndlaLinks.aboutNdla"),
      to: "https://ndla.no/about/about-us",
    },
    {
      text: t("footer.ndlaLinks.vacancies"),
      to: "https://ndla.no/about/utlysninger",
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

  // TODO: Reintroduce this block when we do the language redesign. We're also missing an option
  // const otherLanguages = [
  //   {
  //     to: "/se/subject:e474cd73-5b8a-42cf-b0f1-b027e522057c",
  //     text: "Davvisámegiella",
  //   },
  //   {
  //     to: "/en/subject:27e8623d-c092-4f00-9a6f-066438d6c466",
  //     text: "Українська",
  //   },
  // ];

  return (
    <FooterBlock>
      {config.zendeskWidgetKey && (
        <StyledZendesk id="zendesk" locale={zendeskLanguage} widgetKey={config.zendeskWidgetKey}>
          <QuestionLine />
          {t("askNDLA")}
        </StyledZendesk>
      )}
      <PageContent>
        <FooterWrapper>
          <Logo css={logoStyle} />
          <ContentWrapper>
            {/* TODO: Consider if this should be an actual heading */}
            <StyledHeading asChild consumeCss textStyle="heading.small">
              <span>{t("footer.vision")}</span>
            </StyledHeading>
            <FooterGrid>
              <FooterLinkBlock links={commonLinks} label={t("footer.linksHeader")} />
              <FooterLinkBlock links={privacyLinks} label={t("footer.aboutWebsite")} />
              <div></div>
              {/* <FooterLinkBlock links={otherLanguages} label={t("footer.otherLanguages")} /> */}
              <FooterSocialMedia />
              <FooterTextWrapper>
                <Text textStyle="body.large">{t("footer.info")}</Text>
                <Text textStyle="body.large">
                  <strong>{t("footer.editorInChief")}</strong> Sigurd Trageton
                </Text>
              </FooterTextWrapper>
            </FooterGrid>
          </ContentWrapper>
        </FooterWrapper>
      </PageContent>
    </FooterBlock>
  );
};

const FooterGrid = styled("div", {
  base: {
    display: "grid",
    justifyContent: "space-between",
    gridTemplateColumns: "repeat(3, auto)",
    rowGap: "medium",
    columnGap: "xlarge",
    desktopDown: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    tabletDown: {
      display: "flex",
      flexDirection: "column",
      gap: "medium",
    },
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "xxlarge",
    paddingInlineStart: "xxsmall",
    desktop: {
      paddingInlineStart: "4xlarge",
    },
  },
});
