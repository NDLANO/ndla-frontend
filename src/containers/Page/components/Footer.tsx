/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { QuestionLine, InstagramLine, LinkedinBoxLine, MailLine, YoutubeLine, FacebookCircleFill } from "@ndla/icons";
import { Heading, NdlaLogoEn, NdlaLogoNb, NdlaLogoText, PageContent, Text } from "@ndla/primitives";
import { SafeLink, SafeLinkIconButton } from "@ndla/safelink";
import { css } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { ZendeskButton } from "@ndla/ui";
import config from "../../../config";
import { getLangAttributeValue } from "../../../i18n";

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
    gridColumn: "span 2",
    tabletToDesktop: {
      paddingInline: "xxlarge",
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
      icon: <FacebookCircleFill />,
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
      <Heading id={id} asChild consumeCss textStyle="label.large" fontWeight="bold">
        <span>{t("footer.followUs")}</span>
      </Heading>
      <nav aria-labelledby={id}>
        <SocialMediaLinkList>
          {links.map((link) => (
            <li key={link.to}>
              <SafeLinkIconButton variant="clearSubtle" to={link.to} title={link.text} aria-label={link.text}>
                {link.icon}
              </SafeLinkIconButton>
            </li>
          ))}
          <styled.li css={{ width: "100%" }}>
            <StyledSafeLink to="https://ndla.no/om/nyhetsbrev">
              {t("footer.socialMediaLinks.newsletter")} <MailLine />
            </StyledSafeLink>
          </styled.li>
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

const desktopLogoStyle = css.raw({
  display: "none",
  desktop: {
    display: "block",
  },
});

const MobileLogo = styled(NdlaLogoText, {
  base: {
    display: "block",
    width: "surface.xsmall",
    tabletToDesktop: {
      paddingInline: "xxlarge",
    },
    desktop: {
      display: "none",
    },
  },
});

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const zendeskLanguage = getLangAttributeValue(i18n.language);

  const Logo = i18n.language === "en" ? NdlaLogoEn : NdlaLogoNb;

  const commonLinks = [
    {
      text: t("footer.ndlaLinks.omNdla"),
      to: "https://ndla.no/om/om-ndla",
    },
    {
      text: t("footer.ndlaLinks.aboutNdla"),
      to: "https://ndla.no/om/about-us",
    },
    {
      text: t("footer.ndlaLinks.contact"),
      to: "https://ndla.no/om/kontakt-oss",
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
      {!!config.zendeskWidgetKey && (
        <StyledZendesk id="zendesk" locale={zendeskLanguage} widgetKey={config.zendeskWidgetKey}>
          <QuestionLine />
          {t("askNDLA")}
        </StyledZendesk>
      )}
      <PageContent>
        <FooterWrapper>
          <Logo css={[logoStyle, desktopLogoStyle]} />
          <MobileLogo css={logoStyle} width={undefined} height={undefined} preserveAspectRatio="xMidYMid meet" />
          <ContentWrapper>
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
    width: "100%",
    desktop: {
      paddingInlineStart: "4xlarge",
    },
  },
});
