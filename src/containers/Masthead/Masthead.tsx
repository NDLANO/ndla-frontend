/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Feide, HeartLine } from "@ndla/icons";
import { NdlaLogoText, PageContent } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import SkipToMainContent from "./components/SkipToMainContent";
import { MastheadMenu } from "./MastheadMenu";
import MastheadSearch from "./MastheadSearchV2";
import { AuthContext } from "../../components/AuthenticationContext";
import { BannerAlerts } from "../../components/BannerAlerts";
import FeideLoginButton from "../../components/FeideLoginButton";
import { LanguageSelector } from "../../components/LanguageSelector/LanguageSelector";
import { SKIP_TO_CONTENT_ID } from "../../constants";

const StyledMasthead = styled("header", {
  base: {
    background: "surface.default",
    zIndex: "banner",
    boxShadow: "inner",

    "@media screen and (max-resolution: 3x)": {
      top: 0,
      position: "sticky",
      _print: { position: "relative" },
    },
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    paddingBlock: "xsmall",
  },
});

const MastheadContent = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    tabletWide: {
      paddingInline: "xxlarge",
    },
  },
});

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    alignItems: "center",
  },
});

const FeideLoginLabel = styled("span", {
  base: {
    tabletDown: {
      display: "none",
    },
  },
});

const StyledLanguageSelector = styled(LanguageSelector, {
  base: {
    desktopDown: {
      display: "none",
    },
  },
});

interface MastheadContainerProps extends ComponentProps<"header"> {
  skipToMainContentId?: string;
  showAlerts?: boolean;
}

export const MastheadContainer = ({ skipToMainContentId, showAlerts, children, ...rest }: MastheadContainerProps) => {
  return (
    <StyledMasthead id="masthead" {...rest}>
      {!!skipToMainContentId && <SkipToMainContent skipToMainContentId={skipToMainContentId} />}
      {!!showAlerts && <BannerAlerts />}
      <StyledPageContent variant="wide">
        <MastheadContent id="masthead-content">{children}</MastheadContent>
      </StyledPageContent>
    </StyledMasthead>
  );
};

export const Masthead = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  return (
    <MastheadContainer skipToMainContentId={SKIP_TO_CONTENT_ID} showAlerts>
      <SafeLink to="/" aria-label="NDLA" title="NDLA">
        <NdlaLogoText />
      </SafeLink>
      <ButtonWrapper>
        <StyledLanguageSelector />
        <FeideLoginButton>
          {user ? <HeartLine /> : <Feide />}
          <FeideLoginLabel>{user ? t("myNdla.myNDLA") : t("login")}</FeideLoginLabel>
        </FeideLoginButton>
        <MastheadSearch />
        <MastheadMenu />
      </ButtonWrapper>
    </MastheadContainer>
  );
};
