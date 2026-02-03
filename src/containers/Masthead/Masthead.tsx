/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NdlaLogoText, PageContent } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ComponentProps } from "react";
import { BannerAlerts } from "../../components/BannerAlerts";
import { FeideLoginButton } from "../../components/FeideLoginButton/FeideLoginButton";
import { LanguageSelector } from "../../components/LanguageSelector/LanguageSelector";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { SkipToMainContent } from "./components/SkipToMainContent";
import { MastheadMenu } from "./MastheadMenu";
import { MastheadSearch } from "./MastheadSearch";

const StyledMasthead = styled("header", {
  base: {
    background: "surface.default",
    zIndex: "banner",
    "@media not print": {
      boxShadow: "inner",
    },

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
  },
});

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    alignItems: "center",
    _print: {
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
      <StyledPageContent variant="page">
        <MastheadContent id="masthead-content">{children}</MastheadContent>
      </StyledPageContent>
    </StyledMasthead>
  );
};

export const Masthead = () => {
  return (
    <MastheadContainer skipToMainContentId={SKIP_TO_CONTENT_ID} showAlerts>
      <SafeLink to="/" aria-label="NDLA" title="NDLA">
        <NdlaLogoText />
      </SafeLink>
      <ButtonWrapper>
        <StyledLanguageSelector />
        <FeideLoginButton />
        <MastheadSearch />
        <MastheadMenu />
      </ButtonWrapper>
    </MastheadContainer>
  );
};
