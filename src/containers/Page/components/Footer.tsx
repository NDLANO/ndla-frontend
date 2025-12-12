/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import {
  FacebookCircleFill,
  GithubFill,
  InstagramLine,
  LinkedinBoxLine,
  MailLine,
  QuestionLine,
  YoutubeLine,
} from "@ndla/icons";
import { Heading, NdlaLogoText, PageContent, Text } from "@ndla/primitives";
import { SafeLink, SafeLinkIconButton } from "@ndla/safelink";
import { css } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { ZendeskButton } from "@ndla/ui";
import { useSiteTheme } from "../../../components/SiteThemeContext";
import config from "../../../config";
import { UKR_PAGE_URL } from "../../../constants";

// TODO: Add new translations for the footer.

export const FooterBlock = styled("footer", {
  base: {
    position: "relative",
    background: "primary",
    color: "text.onAction",
    _print: {
      display: "none",
    },
  },
});

const FooterWrapper = styled("div", {
  base: {
    flex: "1",
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    tablet: {
      paddingBlock: "4xlarge",
      paddingBottom: "large",
      gap: "medium",
    },
    tabletDown: {
      flexDirection: "column",
      gap: "xxlarge",
      alignItems: "center",
      paddingBlock: "large",
    },
    "& a:focus-visible": {
      outlineColor: "surface.default",
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

const FooterSiteTheme = styled("div", {
  base: {
    height: "120px",
    clipPath: "polygon(0 0, 100% calc(0% + 5vw), 100% 100%, 0 100%)",
  },
  variants: {
    variant: {
      brand1: {
        background: "surface.brand.1",
      },
      brand2: {
        background: "surface.brand.2",
      },
      brand3: {
        background: "surface.brand.3",
      },
      brand4: {
        background: "surface.brand.4",
      },
      brand5: {
        background: "surface.brand.5",
      },
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
    display: "grid",
    gridTemplateColumns: "auto auto auto auto 1fr",
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
  if (config.githubIconEnabled) {
    links.push({
      text: t("footer.socialMediaLinks.github"),
      to: "https://github.com/NDLANO",
      icon: <GithubFill />,
    });
  }

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
          <styled.li css={{ gridColumn: "span 5" }}>
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
      textAlign: "start",
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

const DesktopSvg = styled("svg", {
  base: {
    display: "none",
    color: "icon.onAction",
    flexShrink: "0",
    width: "120px",
    height: "300px",
    _print: {
      color: "icon.strong",
    },
    tablet: {
      display: "block",
    },
  },
});

const MobileLogo = styled(NdlaLogoText, {
  base: {
    display: "block",
    width: "surface.xsmall",
    tabletToDesktop: {
      paddingInline: "xxlarge",
    },
    tablet: {
      display: "none",
    },
  },
});

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const siteTheme = useSiteTheme();

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

  const otherLanguages = [
    {
      to: UKR_PAGE_URL,
      text: t("languages.ukr"),
    },
    {
      to: "/samling/sma",
      text: t("languages.sma"),
    },
    {
      to: "/samling/se",
      text: t("languages.se"),
    },
  ];

  return (
    <FooterBlock>
      {!!config.zendeskWidgetKey && (
        <StyledZendesk id="zendesk" locale={i18n.language !== "en" ? "no" : "en"} widgetKey={config.zendeskWidgetKey}>
          <QuestionLine />
          {t("askNDLA")}
        </StyledZendesk>
      )}
      <PageContent gutters="always" variant="page">
        <FooterWrapper>
          <ContentWrapper>
            <StyledHeading asChild consumeCss textStyle="heading.small">
              <span>{t("footer.vision")}</span>
            </StyledHeading>
            <LinksWrapper>
              <FooterLinkBlock links={commonLinks} label={t("footer.linksHeader")} />
              <FooterLinkBlock links={privacyLinks} label={t("footer.aboutWebsite")} />
              <FooterLinkBlock links={otherLanguages} label={t("footer.otherLanguages")} />
              <FooterSocialMedia />
            </LinksWrapper>
            <div>
              <Text textStyle="body.large">{t("footer.info")}</Text>
              <Text textStyle="body.large">
                <strong>{t("footer.editorInChief")}</strong> Sigurd Trageton
              </Text>
            </div>
          </ContentWrapper>
          <DesktopSvg width={163} height={383} aria-hidden>
            <use href={`/static/ndla-logo-${i18n.language === "en" ? "en" : "nb"}.svg#icon`} />
          </DesktopSvg>
          <MobileLogo css={logoStyle} width={undefined} height={undefined} preserveAspectRatio="xMidYMid meet" />
        </FooterWrapper>
      </PageContent>
      <FooterSiteTheme variant={siteTheme ?? "brand1"} />
    </FooterBlock>
  );
};

const LinksWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    gap: "xxlarge",
    desktop: {
      paddingInlineEnd: "large",
    },
  },
});
