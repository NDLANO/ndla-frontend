/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ZendeskButton } from "@ndla/button";
import { colors, spacing, stackOrder } from "@ndla/core";
import { Facebook, HelpCircleOutline, Instagram, LinkedIn, EmailOutline, Youtube } from "@ndla/icons/common";
import { Footer, FooterText, EditorName, LanguageSelector } from "@ndla/ui";
import config from "../../../config";
import { supportedLanguages } from "../../../i18n";

const FooterTextWrapper = styled.div`
  p:first-of-type {
    margin-bottom: 0;
  }
  p:last-of-type {
    margin-top: 0;
  }
`;

const FooterWrapper = () => {
  const { t, i18n } = useTranslation();
  const zendeskLanguage = i18n.language === "nb" || i18n.language === "nn" ? "no" : i18n.language;

  const links = [
    {
      to: "https://www.facebook.com/ndla.no",
      text: t("footer.socialMediaLinks.facebook"),
      icon: <Facebook />,
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
      icon: <EmailOutline />,
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
      url: "https://ndla.no/article/personvernerklaering",
      label: t("footer.privacyLink"),
    },
    {
      url: "https://ndla.no/article/erklaering-for-informasjonskapsler",
      label: t("footer.cookiesLink"),
    },
    {
      url: "https://uustatus.no/nn/erklaringer/publisert/8cefdf3d-3272-402a-907b-689ddfc9bba7",
      label: t("footer.availabilityLink"),
    },
  ];

  const ZendeskWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: relative;
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

  const IconCSS = css`
    width: 20px;
    height: 20px;
  `;

  return (
    <>
      {config.zendeskWidgetKey && (
        <ZendeskWrapper>
          <StyledZendesk id="zendesk" locale={zendeskLanguage} widgetKey={config.zendeskWidgetKey}>
            <HelpCircleOutline css={IconCSS} />
            {t("askNDLA")}
          </StyledZendesk>
        </ZendeskWrapper>
      )}
      <Footer
        lang={i18n.language}
        //@ts-ignore Wrongly typed as an array with a single element in frontend-packages.
        commonLinks={commonLinks}
        links={links}
        languageSelector={
          <LanguageSelector
            inverted
            locales={supportedLanguages}
            onSelect={i18n.changeLanguage}
            triggerId="languageSelectorFooter"
          />
        }
        privacyLinks={privacyLinks}
      >
        <FooterTextWrapper>
          <FooterText>
            <EditorName title={t("footer.editorInChief")} name="Sigurd Trageton" />
          </FooterText>
          <FooterText>{t("footer.info")}</FooterText>
        </FooterTextWrapper>
      </Footer>
    </>
  );
};

export default FooterWrapper;
